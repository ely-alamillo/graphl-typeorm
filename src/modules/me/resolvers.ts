import { ResolverMap } from "../../types/graphql-utils";
import { Users } from "../../entity/User";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  // weird bug when merging schemas if no query is provided
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      Users.findOne({ where: { id: session.userId } })
    )
  }
};
