import { Strategy } from "passport";

export interface PassportStrategy {
  name: string;
  strategy: Strategy;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface GitHubProfile {
  id: number;
  name: string;
  username: string;
  role: string;
  emails: Array<{ primary: boolean; value: string }>;
}
