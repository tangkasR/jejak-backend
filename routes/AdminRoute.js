import express from "express";
import {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  Login,
  Logout
} from "../controllers/AdminController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();

router.get("/getadmin", getAdmin);
router.post("/registrasi", createAdmin);
router.put("/editadmin", updateAdmin);
router.delete("/deleteadmin", deleteAdmin);
router.post("/login", Login);
router.delete("/logout", Logout);
router.post("/token", refreshToken);
export default router;
