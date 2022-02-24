export function UserInfo(id: string): string {
  return `query {
	user(login:"${id}") {
    name
    login
    bio
    company
    avatarUrl
    location
    url
	}  
}`;
}
