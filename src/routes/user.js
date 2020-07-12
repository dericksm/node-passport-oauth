const router = require("express").Router();
const passport = require("passport");
const passportConfig = require("../passport");
const UserController = require("../controllers/userController");
const { validateBody, validateBodyLogin } = require("../helpers/routeHelper");

router.post("/signup", validateBody, UserController.signUp);
router.post(
    "/signin",
    validateBodyLogin,
    passport.authenticate("local", { session: false }),
    UserController.signIn
);
router.get(
    "/secret",
    passport.authenticate("jwt", { session: false }),
    UserController.secret
);
router.post(
    "/oauth/google",
    passport.authenticate("google-token", { session: false }),
    UserController.googleOauth
);
router.post(
    "/oauth/facebook",
    passport.authenticate("facebook-token", { session: false }),
    UserController.facebookOauth
);

module.exports = router;