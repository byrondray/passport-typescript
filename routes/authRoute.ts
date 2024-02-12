import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";
import flash from "connect-flash";

const router = express.Router();
router.use(flash());


router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login", {
    failureMessage: req.flash("error"),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
});

export default router;
