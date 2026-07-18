export interface UserData {
  $id: string;
  about: string;
  name: string;
}

export interface UserMemberData extends UserData {
  roles: string[];
  confirmed: boolean;
  joinedAt: string;
}

export interface User extends UserData {
  email: string;
  emailVerification?: boolean;
}
