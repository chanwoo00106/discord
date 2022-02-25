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
      repositories {
        totalCount
      }
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

export const repoQuery = gql`
  query ($id: String!) {
    user(login: $id) {
      login
      name
      avatarUrl
      url
      repositories(first: 4, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes {
          name
          description
        }
        totalCount
      }
    }
  }
`;
