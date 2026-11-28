
import api from "./axios.js";

// Convert MongoDB response into frontend format
const normalizeExam = (exam) => ({
  ...exam,
  id: exam._id || exam.id,

  studentId:
    typeof exam.studentId === "object"
      ? exam.studentId?._id
      : exam.studentId,
});

// Prepare frontend data for MongoDB
const prepareExam = (exam) => ({
  studentId:
    typeof exam.studentId === "object"
      ? exam.studentId?._id
      : exam.studentId,

  examName: exam.examName || exam.exam,
  subject: exam.subject,
  date: exam.date,
  marks: Number(exam.marks),
  total: Number(exam.total),
});

// GET all exams
export const getExams = async () => {
  const response = await api.get("/exams");

  return response.data.data.map(normalizeExam);
};

// CREATE exam
export const createExam = async (exam) => {
  const response = await api.post(
    "/exams",
    prepareExam(exam)
  );

  return normalizeExam(response.data.data);
};

// UPDATE exam
export const updateExam = async (id, exam) => {
  const response = await api.put(
    `/exams/${id}`,
    prepareExam(exam)
  );

  return normalizeExam(response.data.data);
};

// DELETE exam
export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);

  return response.data;
};
