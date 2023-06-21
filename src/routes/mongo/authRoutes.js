import passport from "passport";
import { Router } from "express";
const router = Router();

//vista de login
router.get("/login", (req, res) => {
  res.render("login");
});

// vista de register
router.get("/register", (req, res) => {
  res.render("register");
});

// register post
router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/auth/login",
    failureRedirect: "/error",
  })
);

// login post
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
);

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("login");
  });
});
export default router;
