import api from "./axios.js";
export const getStudents = async () => (await api.get("/students")).data.data;
export const createStudent = async (payload) => (await api.post("/students", payload)).data.data;
export const updateStudent = async (id, payload) => (await api.put(`/students/${id}`, payload)).data.data;
export const deleteStudent = async (id) => (await api.delete(`/students/${id}`)).data;
