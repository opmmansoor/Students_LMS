
import api from "./axios.js";

// GET all students
export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data.data;
};

// CREATE student
export const createStudent = async (student) => {
  const response = await api.post("/students", student);
  return response.data.data;
};

// UPDATE student
export const updateStudent = async (id, student) => {
  const response = await api.put(`/students/${id}`, student);
  return response.data.data;
};

// DELETE student
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
