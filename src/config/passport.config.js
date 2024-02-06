import ps from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import cfg from "./config.js";
import { createHash, isValidPassword } from "../../utils.js";
import { UserService, CartService } from "../services/services.js";



const localStrategy = local.Strategy;

const initializePassport = () => {
  
  ps.use("register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        const admin = email == cfg.ADMIN_EMAIL && password == cfg.ADMIN_PASSWORD

        try {
          const user = await UserService.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await CartService.createCart({});

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cartForNewUser._id,
            role: admin ? "admin" : "user",
          };
          const result = await UserService.create(newUser);
          
          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  ps.use("login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserService.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (err) {}
      }
    )
  );

  ps.use("github",
    new GitHubStrategy(
      {
        clientID: "Iv1.293c8ed3f56bf335",
        clientSecret: "8665c30412fb636b3449f8a9a3fd897f498527c6",
        callbackURL: "/api/sessions/githubcallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {


        try {
          const user = await UserService.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);

          const cartForNewUser = await CartService.createCart({});
  

          const newUser = await UserService.create({
            first_name: profile._json.name,
            last_name: "last_name",
            email: profile._json.email,
            password: "password",
            cart: cartForNewUser._id,
          });


          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github");
        }
      }
    )
  );

  ps.serializeUser((user, done) => {
    done(null, user._id);
  });

  ps.deserializeUser(async (id, done) => {
    const user = await UserService.getById(id);
    done(null, user);
  });
};

export default initializePassport;
