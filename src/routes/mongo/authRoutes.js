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

export default router;
