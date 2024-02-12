import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => { 
    try {
      const user = await getUserByEmailIdAndPassword(email, password); 
      return user
        ? done(null, user)
        : done(null, false, { message: "Your login details are not valid. Please try again" });
    } catch (error) {
      return done(error);
    }
  }
);

passport.serializeUser(function (
  user: Express.User,
  done: (err: any, id?: number) => void
) {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserById(id); 
    if (user) {
      done(null, user); 
    } else {
      done(null, false); 
    }
  } catch (error) {
    done(error); 
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
