import { GraphQLClient } from "graphql-request";
import config from "src/config";

const github = new GraphQLClient("https://api.github.com/graphql");

github.setHeader("Authorization", `Bearer ${config.GITHUB_API}`);

export default github;
