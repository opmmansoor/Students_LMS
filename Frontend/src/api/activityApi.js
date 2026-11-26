
import api from "./axios.js";

// GET all activities
export const getActivities = async () => {
  const response = await api.get("/activities");
  return response.data.data;
};

// CREATE activity
export const createActivity = async (payload) => {
  const response = await api.post("/activities", payload);
  return response.data.data;
};

// UPDATE activity
export const updateActivity = async (id, payload) => {
  const response = await api.put(`/activities/${id}`, payload);
  return response.data.data;
};

// DELETE activity
export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};
