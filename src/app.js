const express = require("express")
const userauth = require("./Routers/userRouter")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const productauth = require("../src/Routers/productRoute")
const CartauthRouter = require("../src/Routers/cartRoute")
const passport = require("passport")
const path = require("path");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const app = express()
app.use(express.json())
app.use(cookieparser())


app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://snitch-e-commercee.onrender.com"
    ],
    credentials: true
}))


app.use(passport.initialize())
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRECT_ID,
            callbackURL: "https://snitch-e-commercee.onrender.com/snitch/api/user/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);

              

                return done(null, profile);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);





app.use("/snitch/api/user", userauth);
app.use("/snitch/api/user", productauth);
app.use("/snitch/user/cart", CartauthRouter);

app.use(express.static(
    path.join(__dirname, "..", "public", "dist")
));

app.get("/{*splat}", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "public", "dist", "index.html")
    );
});

module.exports = app