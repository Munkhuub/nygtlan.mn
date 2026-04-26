import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { getTrialBalance } from "../controllers/report/get-trial-balance";
import { getBalanceSheet } from "../controllers/report/get-balance-sheet";
import { getIncomeStatement } from "../controllers/report/get-income-statement";
import { getAccountLedger } from "../controllers/report/get-account-ledger";

const reportRouter = Router({ mergeParams: true });

reportRouter.use(authenticationMiddleware);

reportRouter.get("/trial-balance", getTrialBalance);
reportRouter.get("/balance-sheet", getBalanceSheet);
reportRouter.get("/income-statement", getIncomeStatement);
reportRouter.get("/accounts/:accountId/ledger", getAccountLedger);

export default reportRouter;
