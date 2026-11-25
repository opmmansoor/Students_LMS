
import Exam from "../models/Exam.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.json({ success: true, data: exams });
});

export const getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.json({ success: true, data: exam });
});

export const createExam = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.body.studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const exam = await Exam.create(req.body);

  res.status(201).json({ success: true, data: exam });
});

export const updateExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.json({ success: true, data: exam });
});

export const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findByIdAndDelete(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.json({ success: true, message: "Exam deleted successfully" });
});
