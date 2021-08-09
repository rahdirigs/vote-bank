import { Router } from "express";
import {
  getElectionById,
  getElections,
  startElection,
  stopElection,
} from "../controllers/election.controller";
import { admin, protect } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/")
  .get(protect, getElections)
  .post(protect, admin, startElection);
router
  .route("/:id")
  .get(protect, getElectionById)
  .put(protect, admin, stopElection);

export default router;
