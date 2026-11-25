
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all students
export const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// GET single student
export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.json({ success: true, data: student });
});

// CREATE student
export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

// UPDATE student
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.json({ success: true, data: student });
});

// DELETE student
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.json({
    success: true,
    message: "Student deleted successfully"
  });
});
