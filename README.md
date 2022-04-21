# Example of using GraphQL in Fastly Compute@Edge

## What is GraphQL?

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.
[Find out more about GraphQL](https://graphql.org/)

## Why run GraphQL at the edge?

Running GraphQL at the edge allows you to move the processing as close to your users as possible and cache any requests sent to the origin to improve speed and reduce origin load.

### Trying it out

Try getting a list of all users with the query below

```
query {
  users {
    id
    name
    email
    address {
      city
    }
    company {
      name
    }
  }
}
```

Or get a list of all posts with this query

```
query {
  posts {
    id
    title
    userId,
    body
  }
}
```
