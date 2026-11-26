import { useCallback, useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./api/studentApi";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "./api/activityApi";
import { getExams, createExam, updateExam, deleteExam } from "./api/examApi";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Overview from "./Components/Overview";
import StudentsList from "./Components/StudentsList";
import Activities from "./Components/Activities";
import Exams from "./Components/Exams";
import Reports from "./Components/Reports";
const empty = { students: [], activities: [], exams: [] };
const normalize = (item) => ({
  ...item,
  id: item._id || item.id,
  studentId: item.studentId ? String(item.studentId) : "",
});
const todayString = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};
export default function App() {
  const [data, setData] = useState(empty),
    [page, setPage] = useState("overview"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const today = todayString(),
    currentMonth = today.slice(0, 7);
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [students, activities, exams] = await Promise.all([
        getStudents(),
        getActivities(),
        getExams(),
      ]);
      setData({
        students: students.map(normalize),
        activities: activities.map(normalize),
        exams: exams.map(normalize),
      });
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          "Unable to load data. Check the backend and MongoDB connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const getPoints = (studentId = "", period = "") =>
    data.activities
      .filter(
        (a) =>
          (!studentId || String(a.studentId) === String(studentId)) &&
          (!period ||
            (period.length === 7
              ? String(a.date).slice(0, 7) === period
              : String(a.date).slice(0, 10) === period)),
      )
      .reduce((sum, a) => sum + (Number(a.points) || 0), 0);
  const getExamAverage = (studentId = "") => {
    const list = data.exams.filter(
      (e) =>
        (!studentId || String(e.studentId) === String(studentId)) &&
        Number(e.total) > 0,
    );
    return list.length
      ? list.reduce(
          (sum, e) => sum + (Number(e.marks) / Number(e.total)) * 100,
          0,
        ) / list.length
      : null;
  };

  const actions = {
    addStudent: async (x) => {
      const r = await createStudent(x);
      setData((p) => ({ ...p, students: [normalize(r), ...p.students] }));
    },
    updateStudent: async (x) => {
      const r = await updateStudent(x.id, x);
      setData((p) => ({
        ...p,
        students: p.students.map((s) => (s.id === x.id ? normalize(r) : s)),
      }));
    },
    deleteStudent: async (id) => {
      await deleteStudent(id);
      setData((p) => ({
        ...p,
        students: p.students.filter((s) => s.id !== id),
        activities: p.activities.filter((a) => a.studentId !== id),
        exams: p.exams.filter((e) => e.studentId !== id),
      }));
    },
    addActivity: async (x) => {
      const r = await createActivity(x);
      setData((p) => ({ ...p, activities: [normalize(r), ...p.activities] }));
    },
    updateActivity: async (x) => {
      const r = await updateActivity(x.id, x);
      setData((p) => ({
        ...p,
        activities: p.activities.map((a) => (a.id === x.id ? normalize(r) : a)),
      }));
    },
    deleteActivity: async (id) => {
      await deleteActivity(id);
      setData((p) => ({
        ...p,
        activities: p.activities.filter((a) => a.id !== id),
      }));
    },
    addExam: async (x) => {
      const r = await createExam(x);
      setData((p) => ({ ...p, exams: [normalize(r), ...p.exams] }));
    },
    updateExam: async (x) => {
      const r = await updateExam(x.id, x);
      setData((p) => ({
        ...p,
        exams: p.exams.map((e) => (e.id === x.id ? normalize(r) : e)),
      }));
    },
    deleteExam: async (id) => {
      await deleteExam(id);
      setData((p) => ({ ...p, exams: p.exams.filter((e) => e.id !== id) }));
    },
  };
  const titles = {
    overview: "Overview",
    students: "Students",
    activities: "Daily Activities",
    exams: "Examination Results",
    reports: "Reports",
  };
  const shared = {
    data,
    actions,
    getPoints,
    getExamAverage,
    today,
    currentMonth,
  };
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar page={page} setPage={setPage} />
      <main className="min-w-0 flex-1">
        <Header title={titles[page]} />
        <div className="p-4 md:p-8">
          {loading && <p className="mb-4 text-blue-600">Loading LMS data...</p>}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}{" "}
              <button className="ml-2 underline" onClick={loadData}>
                Retry
              </button>
            </div>
          )}
          {page === "overview" && <Overview {...shared} setPage={setPage} />}
          {page === "students" && <StudentsList {...shared} />}
          {page === "activities" && <Activities {...shared} />}
          {page === "exams" && <Exams {...shared} />}
          {page === "reports" && <Reports {...shared} />}
          <footer className="mt-8 text-center text-xs text-slate-400">
            Campus LMS · Student Performance Management
          </footer>
        </div>
      </main>
    </div>
  );
}
