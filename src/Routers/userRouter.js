const express = require("express")
const {register,googleouth} = require("../controllers/userController")
const {Login} = require("../controllers/userController")
const {getme} = require("../controllers/userController")
const passport = require("passport")
const middileware = require("../middileware/middileware")
const userauth = express.Router()

userauth.post("/register",register)
userauth.post("/login",Login)
userauth.get("/get-me" ,middileware,getme)

userauth.get(
  "/google/register",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "register"
  })
)
userauth.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userauth.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleouth
  
);

module.exports = userauth