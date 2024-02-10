import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { GitHubProfile, User } from "../../interfaces/index";
import { Request } from "express";
import {
  getUserById,
  findOrCreateUserByGithub,
} from "../../controllers/userController";
import * as dotenv from "dotenv";

dotenv.config();

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: User | false) => void
  ) => {
    try {
      const userProfile: GitHubProfile = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        username: profile.username,
        emails: profile.emails,
      };

      const user = await findOrCreateUserByGithub(userProfile);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (
  id: number,
  done: (err: any, user?: Express.User | false | null) => void
) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
