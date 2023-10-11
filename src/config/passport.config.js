import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../dao/models/users.model.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  
  passport.use("register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use("login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (err) {}
      }
    )
  );

  passport.use("github",
    new GitHubStrategy(
      {
        clientID: "Iv1.293c8ed3f56bf335",
        clientSecret: "8665c30412fb636b3449f8a9a3fd897f498527c6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //console.log(profile);
        try {
          const user = await userModel.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);
          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
