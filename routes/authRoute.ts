import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";
import flash from "connect-flash";

const router = express.Router();

router.use(flash());


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true, 
  })
);

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login", {
    failureMessage: req.flash("error"),
  });
});


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
