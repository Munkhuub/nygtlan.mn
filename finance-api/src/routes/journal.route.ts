import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  voidJournalEntry,
} from "../controllers/journal";

const journalRouter = Router({ mergeParams: true });

journalRouter.use(authenticationMiddleware);

journalRouter.get("/", getJournalEntries);
journalRouter.post("/", createJournalEntry);
journalRouter.get("/:entryId", getJournalEntryById);
journalRouter.patch("/:entryId/void", voidJournalEntry);

export default journalRouter;
