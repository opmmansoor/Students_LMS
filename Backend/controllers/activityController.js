
import Activity from "../models/Activity.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.json({ success: true, data: activities });
});

export const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.json({ success: true, data: activity });
});

export const createActivity = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const student = await Student.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const activity = await Activity.create(req.body);

  res.status(201).json({ success: true, data: activity });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.json({ success: true, data: activity });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  res.json({ success: true, message: "Activity deleted successfully" });
});
