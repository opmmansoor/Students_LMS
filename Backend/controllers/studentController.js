import mongoose from "mongoose";
import Student from "../models/Student.js";
import Activity from "../models/Activity.js";
import Exam from "../models/Exam.js";
import asyncHandler from "../middleware/asyncHandler.js";

const allowedFields = ['name', 'code', 'className', 'discipline', 'attitude', 'status'];
const pick = (body) => Object.fromEntries(allowedFields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
const validateId = (id, res) => { if (!mongoose.isValidObjectId(id)) { res.status(400); throw new Error("Invalid student ID"); } };

export const getStudents = asyncHandler(async (req, res) => {
  const records = await Student.find().sort({ createdAt: -1 });
  res.json({ success: true, count: records.length, data: records });
});

export const getStudent = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Student.findById(req.params.id);
  if (!record) { res.status(404); throw new Error("Student not found"); }
  res.json({ success: true, data: record });
});

export const createStudent = asyncHandler(async (req, res) => {
  const record = await Student.create(pick(req.body));
  res.status(201).json({ success: true, data: record });
});

export const updateStudent = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Student.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!record) { res.status(404); throw new Error("Student not found"); }
  res.json({ success: true, data: record });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Student.findByIdAndDelete(req.params.id);
  if (!record) { res.status(404); throw new Error("Student not found"); }
  await Promise.all([
    Activity.deleteMany({ studentId: record._id }),
    Exam.deleteMany({ studentId: record._id }),
  ]);
  res.json({ success: true, message: "Student and related records deleted successfully" });
});
