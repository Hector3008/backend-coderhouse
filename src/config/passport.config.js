import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../dao/models/users.model.js";
import cartModel from "../dao/models/cart.model.js";
import cfg from "./config.js";
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

        const admin = email == cfg.ADMIN_EMAIL && password == cfg.ADMIN_PASSWORD

        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await cartModel.create({});

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cartForNewUser._id,
            role: admin ? "admin" : "user",
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
        //console.log("profile: ",profile);
        try {
          const user = await userModel.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);
          
          const cartForNewUser = await cartModel.create({});
          //console.log('cartfornewuser: ', cartForNewUser);

          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "last_name",
            email: profile._json.email,
            password: "password",
            cart: cartForNewUser._id,
          });

          //console.log("newUser: ",newUser);
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
