export const githubUser = (id: string) => `query {
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
