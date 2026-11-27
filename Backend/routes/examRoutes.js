
import express from "express";

import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

const router = express.Router();

// Exam routes
router.route("/")
  .get(getExams)
  .post(createExam);

router.route("/:id")
  .get(getExam)
  .put(updateExam)
  .delete(deleteExam);

export default router;
