
import mongoose from "mongoose";
import Activity from "../models/Activity.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Allowed fields
const allowedFields = [
  "studentId",
  "title",
  "category",
  "description",
  "points",
  "date",
  "completed",
  "teacher",
  "note",
];

// Pick only allowed fields
const pick = (body) =>
  Object.fromEntries(
    allowedFields
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]])
  );

// Validate MongoDB ID
const validateId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid activity ID");
  }
};

// GET all activities
export const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
  });
});

// GET single activity
export const getActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const activity = await Activity.findById(req.params.id)
    .populate("studentId", "firstName lastName class");

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    data: activity,
  });
});

// CREATE activity
export const createActivity = asyncHandler(async (req, res) => {
  const data = pick(req.body);

  if (!mongoose.isValidObjectId(data.studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findById(data.studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const activity = await Activity.create(data);

  res.status(201).json({
    success: true,
    data: activity,
  });
});

// UPDATE activity
export const updateActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const updates = pick(req.body);

  if (updates.studentId !== undefined) {
    if (!mongoose.isValidObjectId(updates.studentId)) {
      res.status(400);
      throw new Error("Invalid student ID");
    }

    const student = await Student.findById(updates.studentId);

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }
  }

  const activity = await Activity.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).populate("studentId", "firstName lastName class");

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    data: activity,
  });
});

// DELETE activity
export const deleteActivity = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const activity = await Activity.findByIdAndDelete(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    message: "Activity deleted successfully",
  });
});
