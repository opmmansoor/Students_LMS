import express from "express";
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from "../controllers/activityController.js";

const router = express.Router();
router.route("/").get(getActivities).post(createActivity);
router.route("/:id").get(getActivity).put(updateActivity).delete(deleteActivity);
export default router;
