import { Application } from "express";
import passport from "passport";
import PassportConfig from "./PassportConfig";
import { PassportStrategy } from "../interfaces";
import localStrategy from "./passportStrategies/localStrategy";
import githubStrategy from "./passportStrategies/githubStrategy";

// No need to actually pass the instance of passport since it returns a singleton
const passportConfig = new PassportConfig([localStrategy, githubStrategy]);
// passportConfig.addStrategies([localStrategy /* passportGitHubStrategy */]);
const passportMiddleware = (app: Application): void => {
  app.use(passport.initialize());
  app.use(passport.session());
};

export default passportMiddleware;
