import mongoose from "mongoose";
import Activity from "../models/Activity.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

const allowedFields = ['studentId', 'date', 'category', 'description', 'points', 'completed', 'teacher', 'note'];
const pick = (body) => Object.fromEntries(allowedFields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
const validateId = (id, res) => { if (!mongoose.isValidObjectId(id)) { res.status(400); throw new Error("Invalid activity ID"); } };

export const getActivities = asyncHandler(async (req, res) => {
  const records = await Activity.find().sort({ createdAt: -1 });
  res.json({ success: true, count: records.length, data: records });
});

export const getActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Activity.findById(req.params.id);
  if (!record) { res.status(404); throw new Error("Activity not found"); }
  res.json({ success: true, data: record });
});

export const createActivity = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.studentId)) { res.status(400); throw new Error("Invalid student ID"); }
  const student = await Student.findById(req.body.studentId);
  if (!student) { res.status(404); throw new Error("Student not found"); }
  const record = await Activity.create(pick(req.body));
  res.status(201).json({ success: true, data: record });
});

export const updateActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  if (req.body.studentId !== undefined) {
    if (!mongoose.isValidObjectId(req.body.studentId)) { res.status(400); throw new Error("Invalid student ID"); }
    const student = await Student.findById(req.body.studentId);
    if (!student) { res.status(404); throw new Error("Student not found"); }
  }
  const record = await Activity.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!record) { res.status(404); throw new Error("Activity not found"); }
  res.json({ success: true, data: record });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Activity.findByIdAndDelete(req.params.id);
  if (!record) { res.status(404); throw new Error("Activity not found"); }
  res.json({ success: true, message: "Activity deleted successfully" });
});
