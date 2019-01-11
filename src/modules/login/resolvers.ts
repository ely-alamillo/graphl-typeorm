import * as bcrypt from "bcryptjs";

import { ResolverMap } from "../../types/graphql-utils";
import { Users } from "../../entity/User";
import { GQL } from "../../types/schema";
import { invalidLogin } from "./errorMsg";
import { confirmEmail } from "../../routes/confirmEmail";

const invalidLoginRes = [
  {
    path: "email",
    message: invalidLogin
  }
];

export const resolvers: ResolverMap = {
  // weird bug when merging schemas if no query is provided
  Query: {
    bye2: () => "bye"
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      {}
    ) => {
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return invalidLoginRes;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: confirmEmail
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return invalidLoginRes;
      }

      return null;
    }
  }
};
