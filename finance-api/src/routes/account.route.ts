import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import {
  createAccount,
  getAccountById,
  getAccounts,
  loadDefaultAccounts,
} from "../controllers/account";

const accountRouter = Router({ mergeParams: true });

accountRouter.use(authenticationMiddleware);

accountRouter.get("/", getAccounts);
accountRouter.post("/", createAccount);
accountRouter.post("/load-defaults", loadDefaultAccounts);
accountRouter.get("/:accountId", getAccountById);

export default accountRouter;
