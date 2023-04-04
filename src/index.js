import { includeBytes } from "fastly:experimental";
import { Router } from "@fastly/expressly";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { schema } from "./schema";

const router = new Router();

import ManifestContent from "./assets/manifest.md";
router.get("/.well-known/fastly/demo-manifest", (_, res) => {
  res.text(ManifestContent);
});

const png = includeBytes("src/assets/graphql-logo.png");
router.get("/logo.png", (_, res) => {
  res.headers.set("content-type", "image/png");
  res.send(png);
});

import logoSvg from "./assets/graphql-logo.svg";
router.get("/logo.svg", (_, res) => {
  res.headers.set("content-type", "image/svg+xml");
  res.send(logoSvg);
});

router.all("*", async (req, res) => {
  // If the request does not include an accept header (or has a non-browser-like value), 
  // add a default.
  if (
    !req.headers.get("accept") ||
    req.headers.get("accept") === "*/*"
  ) {
    req.headers.set(
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    );
  }

  // Determine whether we should render GraphiQL instead of returning an API response.
  if (shouldRenderGraphiQL(req)) {
    res.html(
      renderGraphiQL({
        defaultQuery: `# Enter your GraphQL query here
query {
  users {
    id
    name
    email
  }
}`,
      })
    );
  } else {
    let body = await req.json().catch(() => ({}));

    // Create a generic Request object that can be consumed by Graphql Helix's API.
    const request = {
      body: body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };
  
    // Extract the Graphql parameters from the request.
    const { operationName, query, variables } = getGraphQLParameters(request);

    // Validate and execute the query.
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    // Respond with the result.
    for (const { name, value } of result.headers) {
      res.headers.set(name, value);
    }
    res.json(result.payload);
  }
});

router.listen();
