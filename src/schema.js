import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

export const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      echo: {
        args: {
          text: {
            type: GraphQLString,
          },
        },
        type: GraphQLString,
        resolve: (_root, args) => {
          return args.text;
        },
      },
    }),
  }),
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      users: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: "User",
            fields: () => ({
              id: { type: GraphQLInt },
              name: { type: GraphQLString },
              username: { type: GraphQLString },
              email: { type: GraphQLString },
              phone: { type: GraphQLString },
              website: { type: GraphQLString },
              address: {
                type: new GraphQLObjectType({
                  name: "Address",
                  fields: () => ({
                    street: { type: GraphQLString },
                    suite: { type: GraphQLString },
                    city: { type: GraphQLString },
                    zipcode: { type: GraphQLString },
                    geo: {
                      type: new GraphQLObjectType({
                        name: "Geo",
                        fields: () => ({
                          lat: { type: GraphQLString },
                          lng: { type: GraphQLString },
                        }),
                      }),
                    },
                  }),
                }),
              },
              company: {
                type: new GraphQLObjectType({
                  name: "Company",
                  fields: () => ({
                    name: { type: GraphQLString },
                    catchPhrase: { type: GraphQLString },
                    bs: { type: GraphQLString },
                  }),
                }),
              },
            }),
          })
        ),
        resolve: async () => {
          // Force caching for 1 minute.
          let cacheOverride = new CacheOverride("override", { ttl: 60 });

          const req = await fetch(
            "https://jsonplaceholder.typicode.com/users",
            { 
              backend: "my_api",
              cacheOverride
            }
          );

          return req.json();
        },
      },
      posts: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: "Post",
            fields: () => ({
              id: { type: GraphQLInt },
              title: { type: GraphQLString },
              body: { type: GraphQLString },
              userId: { type: GraphQLInt },
            }),
          }),
        ),
        resolve: async () => {
          const req = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            { backend: "my_api" }
          );

          return req.json();
        }
      },
    }),
  }),
});
