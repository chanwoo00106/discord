export interface Repos {
  data: Data;
}

export interface Data {
  user: User;
}

export interface User {
  login: string;
  name: string;
  contributionsCollection: ContributionsCollection;
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface ContributionDay {
  contributionCount: number;
  date: Date;
}
