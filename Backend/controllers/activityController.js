
import mongoose from "mongoose";

import Activity from "../models/Activity.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all activities
export const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities
  });
});

// GET single activity
export const getActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid activity ID");
  }

  const activity = await Activity.findById(id)
    .populate("studentId", "firstName lastName class");

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    data: activity
  });
});

// CREATE activity
export const createActivity = asyncHandler(async (req, res) => {
  const { studentId, title, description, points, date } = req.body;

  if (!mongoose.isValidObjectId(studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const activity = await Activity.create({
    studentId,
    title,
    description,
    points,
    date
  });

  res.status(201).json({
    success: true,
    data: activity
  });
});

// UPDATE activity
export const updateActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid activity ID");
  }

  const allowedFields = [
    "studentId",
    "title",
    "description",
    "points",
    "date"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

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
    id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).populate("studentId", "firstName lastName class");

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    data: activity
  });
});

// DELETE activity
export const deleteActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid activity ID");
  }

  const activity = await Activity.findByIdAndDelete(id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.status(200).json({
    success: true,
    message: "Activity deleted successfully"
  });
});
