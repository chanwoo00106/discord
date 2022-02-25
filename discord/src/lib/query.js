import { gql } from "graphql-request";

export const userQuery = gql`
  query userInfo($id: String!) {
    user(login: $id) {
      name
      login
      bio
      company
      avatarUrl
      location
      url
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
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
