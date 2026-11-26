import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

const allowedFields = ['studentId', 'exam', 'subject', 'date', 'marks', 'total', 'remark'];
const pick = (body) => Object.fromEntries(allowedFields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
const validateId = (id, res) => { if (!mongoose.isValidObjectId(id)) { res.status(400); throw new Error("Invalid exam ID"); } };

export const getExams = asyncHandler(async (req, res) => {
  const records = await Exam.find().sort({ createdAt: -1 });
  res.json({ success: true, count: records.length, data: records });
});

export const getExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Exam.findById(req.params.id);
  if (!record) { res.status(404); throw new Error("Exam not found"); }
  res.json({ success: true, data: record });
});

export const createExam = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.studentId)) { res.status(400); throw new Error("Invalid student ID"); }
  const student = await Student.findById(req.body.studentId);
  if (!student) { res.status(404); throw new Error("Student not found"); }
  const record = await Exam.create(pick(req.body));
  res.status(201).json({ success: true, data: record });
});

export const updateExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  if (req.body.studentId !== undefined) {
    if (!mongoose.isValidObjectId(req.body.studentId)) { res.status(400); throw new Error("Invalid student ID"); }
    const student = await Student.findById(req.body.studentId);
    if (!student) { res.status(404); throw new Error("Student not found"); }
  }
  const record = await Exam.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!record) { res.status(404); throw new Error("Exam not found"); }
  res.json({ success: true, data: record });
});

export const deleteExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);
  const record = await Exam.findByIdAndDelete(req.params.id);
  if (!record) { res.status(404); throw new Error("Exam not found"); }
  res.json({ success: true, message: "Exam deleted successfully" });
});
