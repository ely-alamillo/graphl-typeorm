import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { Users } from "../../entity/User";

export const resolvers: ResolverMap = {
  // weird bug when merging schemas if no query is provided
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const userAlreadyExists = await Users.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExists) {
        return [{ path: "email", message: "already taken" }];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = Users.create({ email, password: hashedPassword });
      await user.save();
      return null;
    }
  }
};
