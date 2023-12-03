import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";

export const refreshToken = async (req, res) => {
  try {
    let refreshToken = req.cookie.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const admin = AdminModel.findOne({
      where: {
        token: refreshToken
      }
    });
    if (!admin) return res.sendStatus(403);

    const adminId = admin.id;
    refreshToken = jwt.sign({ adminId }, process.env.REFRESH_TOKEN, {
      expiresIn: "1d"
    });
    await AdminModel.update(
      {
        token: refreshToken
      },
      {
        where: {
          id: adminId
        }
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 9999 * 60 * 60 * 1000
    });
    res.json({ refreshToken });
  } catch (error) {
    console.log(error);
  }
};
