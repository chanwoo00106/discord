export interface UserInfoI {
  user: {
    name: string;
    login: string;
    bio: string;
    company: string;
    avatarUrl: string;
    location: string;
    url: string;
    repositories: {
      totalCount: number;
    };
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
      };
    };
  };
}
