import { Router } from "flight-path";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult,
} from "graphql-helix";
import { schema } from "./schema";

const router = new Router();

import ManifestContent from "./assets/manifest.yaml";
router.route("*", "/.well-known/fastly/demo-manifest", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(ManifestContent)
})

const png = fastly.includeBytes("src/assets/graphql-logo.png");
router.get("/logo.png", (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.send(png)
})

import logoSvg from "./assets/graphql-logo.svg";
router.get("/logo.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(logoSvg)
})

router.route("*", "*", async (req, res) => {
  let body = {};

  try {
    body = await req.json();
  } catch (e) {}

  // Create a generic Request object that can be consumed by Graphql Helix's API
  const request = {
    body: body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  /**
   * If the request does not include an accept header (or has a non browser like value), for example basic curls, add a default
   */
  if (!request.headers.accept || request.headers.accept === "*/*") {
    request.headers.accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
  }

  // Determine whether we should render GraphiQL instead of returning an API response
  if (shouldRenderGraphiQL(request)) {
    res.setHeader("Content-Type", "text/html");
    res.send(
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
    // Extract the Graphql parameters from the request
    const { operationName, query, variables } = getGraphQLParameters(request);

    // Validate and execute the query
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    sendResult(result, res);
  }
});

router.listen();
