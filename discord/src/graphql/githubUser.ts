import { gql } from "graphql-request";

export const githubUser = (id: string) => gql`query {
	user(login:"${id}") {
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
}`;
