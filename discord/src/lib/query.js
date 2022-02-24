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

export const vsQuery = gql`
  query ($id: String!) {
    user(login: $id) {
      login
      name
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;
