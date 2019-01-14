import { Resolver, GraphQLMiddleware } from "../types/graphql-utils";

export const createMiddleware = (
  middlewareFn: GraphQLMiddleware,
  resolverFn: Resolver
) => {
  return (parent: any, args: any, ctx: any, info: any) =>
    middlewareFn(resolverFn, parent, args, ctx, info);
};
