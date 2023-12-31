import express from "express";
import { approveUser, createUser, deleteApprovedUser, deleteUser, getUser, getUsers, setDisableUser, updateApprovedUser, updateUser, updateUserProfile } from "../controllers";
import { verifyUser, adminOnly } from "../middleware";
const userRouter = express.Router();


userRouter.get("/", verifyUser, adminOnly, getUsers);
userRouter.get("/:id", verifyUser, adminOnly, getUser);
userRouter.post("/", createUser);
userRouter.post("/:id/approve", verifyUser, adminOnly, approveUser);
userRouter.put("/:id/profile", verifyUser, updateUserProfile);
userRouter.put("/:id", verifyUser, adminOnly, updateUser);
userRouter.put("/:id/approve", verifyUser, adminOnly, updateApprovedUser);
userRouter.put("/:id/disable", verifyUser, adminOnly, setDisableUser);
userRouter.delete("/:id", verifyUser, adminOnly, deleteUser);
userRouter.delete("/:id/approve", verifyUser, adminOnly, deleteApprovedUser);


export { userRouter };
