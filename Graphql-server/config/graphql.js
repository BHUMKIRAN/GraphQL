import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "../gql/schema.js";
import { resolvers } from "../gql/resolvers.js";
export const startServer = async (app) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  console.log(
    `GraphQL ready at http://localhost:8080${apolloServer.graphqlPath}`,
  );
};
