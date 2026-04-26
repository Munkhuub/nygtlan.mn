import { config } from "dotenv";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.route";
import companyRouter from "./routes/company.route";
import accountRouter from "./routes/account.route";
import journalRouter from "./routes/journal.route";
import reportRouter from "./routes/report.route";

config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Accounting API is running" });
});

app.use("/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/companies/:companyId/accounts", accountRouter);
app.use("/api/companies/:companyId/journal-entries", journalRouter);
app.use("/api/companies/:companyId/reports", reportRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
