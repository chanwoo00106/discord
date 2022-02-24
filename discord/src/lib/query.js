import { gql } from "graphql-request";

export const userQuery = gql`
  query ($id: String!) {
    user(login: $id) {
      name
      login
      bio
      company
      avatarUrl
      location
      url
    }
  }
`;
