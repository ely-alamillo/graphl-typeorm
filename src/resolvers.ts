import * as bcrypt from "bcryptjs";
import { ResolverMap } from "./types/graphql-utils";
import { GQL } from "./types/schema";
import { Users } from "./entity/User";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = Users.create({ email, password: hashedPassword });
      await user.save();
      return true;
    }
  }
};
