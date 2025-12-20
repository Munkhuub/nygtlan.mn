import { Router } from "express";

import { updateProfileById } from "../controllers/profile/put-profile-by-id";
import { getProfileById } from "../controllers/profile/get-profile";
import { createProfileController } from "../controllers/profile/createProfileControlller";

export const profileRouter = Router();

profileRouter.post("/", createProfileController);
profileRouter.get("/:userId", getProfileById);
profileRouter.put("/:id", updateProfileById);

export default profileRouter;
