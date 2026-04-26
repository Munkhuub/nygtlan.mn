import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { createCompany } from "../controllers/company/createCompanyController";
import { getCompanies } from "../controllers/company/get-companies";
import { getCompanyById } from "../controllers/company/get-company-by-id";
import { updateCompany } from "../controllers/company/updateCompanyController";
import { deleteCompany } from "../controllers/company/deleteCompanyController";

const companyRouter = Router();

// All routes require authentication
companyRouter.use(authenticationMiddleware);

companyRouter.post("/", createCompany);
companyRouter.get("/", getCompanies);
companyRouter.get("/:id", getCompanyById);
companyRouter.patch("/:id", updateCompany);
companyRouter.delete("/:id", deleteCompany);

export default companyRouter;
