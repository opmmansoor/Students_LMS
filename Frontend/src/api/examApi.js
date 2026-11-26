import api from "./axios.js";
export const getExams = async () => (await api.get("/exams")).data.data;
export const createExam = async (payload) => (await api.post("/exams", payload)).data.data;
export const updateExam = async (id, payload) => (await api.put(`/exams/${id}`, payload)).data.data;
export const deleteExam = async (id) => (await api.delete(`/exams/${id}`)).data;
