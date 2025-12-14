import { config } from "dotenv";
import cors from "cors";
import express from "express";
import profileRouter from "../src/routes/profile.route";
import authRouter from "../src/routes/auth.route";
import { bankCardRouter } from "../src/routes/bankCard.route";
import { donationRouter } from "../src/routes/donation.route";

config();

const app = express();

app
  .use(cors())
  .use(express.json())
  .use("/profile", profileRouter)
  .use("/auth", authRouter)
  .use("/bankCard", bankCardRouter)
  .use("/donation", donationRouter);

app.get("/api", (req, res) => {
  res.json({ message: "API is healthy!", timestamp: new Date().toISOString() });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
