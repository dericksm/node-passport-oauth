const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/User");

passport.use(
    new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: process.env.TOKEN,
        },
        async(payload, done) => {
            try {
                // Check if user exists
                const user = User.findById(payload.sub);
                if (!user) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new GooglePlusTokenStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        async(acessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ "google.id": profile.id });
                if (user) {
                    return done(null, user);
                }
                const newUser = User({
                    method: "google",
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                });

                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, false, error.message);
            }
        }
    )
);

passport.use(
    new FacebookTokenStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        },
        async(acessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ "facebook.id": profile.id });
                if (user) {
                    return done(null, user);
                }
                const newUser = User({
                    method: "facebook",
                    facebook: {
                        id: profile.id,
                        email: profile.emails[0].value,
                    },
                });

                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, false, error.message);
            }
        }
    )
);

passport.use(
    new LocalStrategy({
            usernameField: "email",
        },
        async(email, password, done) => {
            try {
                //Find the user
                const user = await User.findOne({ "local.email": email });
                if (!user) return done(null, false);

                //Check if password is right
                const passwordCorrect = await user.isValidPassword(password);
                if (!passwordCorrect) return done(null, false);

                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);