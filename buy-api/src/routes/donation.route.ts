import { Router } from "express";
import { createDonationController } from "../controllers/donation/createDonationController";
import { getDonationsByRecipient } from "../controllers/donation/getDonationsByRecipient";

export const donationRouter = Router();

donationRouter.post("/", createDonationController);
donationRouter.get("/:userId", getDonationsByRecipient);
