import express from "express";
import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  Login,
  Logout
} from "../controllers/AdminController.js";

const router = express.Router();

router.get("/getadmin/:id", getAdminById);
router.post("/registrasi", createAdmin);
router.put("/editadmin/:id", updateAdmin);
router.delete("/deleteadmin/:id", deleteAdmin);
router.post("/login", Login);
router.delete("/logout/:id", Logout);
export default router;
