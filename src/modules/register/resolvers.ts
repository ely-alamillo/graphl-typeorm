import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { ResolverMap } from "../../types/graphql-utils";
import { Users } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMsg";
import { GQL } from "../../types/schema";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmLink } from "../../utils/createConfirmLink";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

export const resolvers: ResolverMap = {
  // weird bug when merging schemas if no query is provided
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      const { email, password } = args;

      const userAlreadyExists = await Users.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExists) {
        return [{ path: "email", message: duplicateEmail }];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = Users.create({ email, password: hashedPassword });
      await user.save();

      if (process.env.NODE_ENV !== "test") {
        await sendEmail(email, await createConfirmLink(url, user.id, redis));
      }

      return null;
    }
  }
};
