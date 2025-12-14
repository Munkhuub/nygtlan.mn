import { Router } from "express";
import createBankCardController from "../controllers/bank-card/createBankCardController";
import { updateBankCardById } from "../controllers/bank-card/put-bankCard-by-id";

export const bankCardRouter = Router();

bankCardRouter.post("/", createBankCardController);
bankCardRouter.put("/:id", updateBankCardById);
