import { useCallback, useEffect, useState } from "react";

// STUDENT API
import {
  getStudents,
  createStudent,
  updateStudent as updateStudentApi,
  deleteStudent as deleteStudentApi,
} from "./api/studentApi";

// ACTIVITY API
import {
  getActivities,
  createActivity,
  updateActivity as updateActivityApi,
  deleteActivity as deleteActivityApi,
} from "./api/activityApi";

// EXAM API
import {
  getExams,
  createExam,
  updateExam as updateExamApi,
  deleteExam as deleteExamApi,
} from "./api/examApi";

// COMPONENTS
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Overview from "./Components/Overview";
import StudentsList from "./Components/StudentsList";
import Activities from "./Components/Activities";
import Exams from "./Components/Exams";
import Reports from "./Components/Reports";

// --------------------------------
// INITIAL DATA
// --------------------------------

const empty = {
  students: [],
  activities: [],
  exams: [],
};

// --------------------------------
// NORMALIZE MONGODB ID REFERENCES
// --------------------------------

const normalizeRecord = (item) => ({
  ...item,

  // MongoDB _id -> frontend id
  id: String(item._id || item.id),

  // Handle populated or normal studentId
  studentId: item.studentId
    ? String(item.studentId._id || item.studentId.id || item.studentId)
    : "",
});

// --------------------------------
// NORMALIZE STUDENT DATA
// --------------------------------

const normalizeStudent = (student) => ({
  ...normalizeRecord(student),

  name:
    student.name ||
    `${student.firstName || ""} ${student.lastName || ""}`.trim(),

  className: student.className || student.class || "",

  code: student.code || student.admissionNumber || "",

  status: student.status || (student.isActive === false ? "TC" : "Active"),
});

// --------------------------------
// GET TODAY'S DATE
// --------------------------------

const todayString = () => {
  const date = new Date();

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

// --------------------------------
// MAIN APP
// --------------------------------

export default function App() {
  const [data, setData] = useState(empty);

  const [page, setPage] = useState("overview");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const today = todayString();

  const currentMonth = today.slice(0, 7);

  // --------------------------------
  // FETCH ALL DATA
  // --------------------------------

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
        students: students.map(normalizeStudent),

        activities: activities.map(normalizeRecord),

        exams: exams.map(normalizeRecord),
      });
    } catch (error) {
      console.error("Data fetching error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load data. Check backend and MongoDB connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------
  // LOAD DATA WHEN APP STARTS
  // --------------------------------

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --------------------------------
  // ACTIVITY POINT CALCULATION
  // --------------------------------

  const getPoints = (studentId = "", period = "") => {
    return data.activities
      .filter((activity) => {
        const matchesStudent =
          !studentId || String(activity.studentId) === String(studentId);

        const matchesPeriod =
          !period ||
          (period.length === 7
            ? String(activity.date).slice(0, 7) === period
            : String(activity.date).slice(0, 10) === period);

        return matchesStudent && matchesPeriod;
      })
      .reduce((sum, activity) => sum + (Number(activity.points) || 0), 0);
  };

  // --------------------------------
  // EXAM AVERAGE CALCULATION
  // --------------------------------

  const getExamAverage = (studentId = "") => {
    const examList = data.exams.filter((exam) => {
      const matchesStudent =
        !studentId || String(exam.studentId) === String(studentId);

      const validTotal = Number(exam.total) > 0;

      return matchesStudent && validTotal;
    });

    if (examList.length === 0) {
      return null;
    }

    const totalPercentage = examList.reduce((sum, exam) => {
      const percentage = (Number(exam.marks) / Number(exam.total)) * 100;

      return sum + percentage;
    }, 0);

    return totalPercentage / examList.length;
  };

  // =================================
  // STUDENT CRUD - MONGODB
  // =================================

  // CREATE STUDENT

  const addStudent = async (student) => {
    const response = await createStudent(student);

    const savedStudent = normalizeStudent(response);

    setData((prev) => ({
      ...prev,

      students: [savedStudent, ...prev.students],
    }));

    return savedStudent;
  };

  // UPDATE STUDENT

  const updateStudent = async (student) => {
    const studentId = student.id || student._id;

    const response = await updateStudentApi(studentId, student);

    const updatedStudent = normalizeStudent(response);

    setData((prev) => ({
      ...prev,

      students: prev.students.map((item) =>
        String(item.id) === String(studentId) ? updatedStudent : item,
      ),
    }));

    return updatedStudent;
  };

  // DELETE STUDENT

  const removeStudent = async (id) => {
    await deleteStudentApi(id);

    setData((prev) => ({
      ...prev,

      students: prev.students.filter(
        (student) => String(student.id) !== String(id),
      ),
    }));
  };

  // =================================
  // ACTIVITY CRUD - MONGODB
  // =================================

  // CREATE ACTIVITY

  const addActivity = async (activity) => {
    const response = await createActivity(activity);

    const savedActivity = normalizeRecord(response);

    setData((prev) => ({
      ...prev,

      activities: [savedActivity, ...prev.activities],
    }));

    return savedActivity;
  };

  // UPDATE ACTIVITY

  const updateActivity = async (activity) => {
    const activityId = activity.id || activity._id;

    const response = await updateActivityApi(activityId, activity);

    const updatedActivity = normalizeRecord(response);

    setData((prev) => ({
      ...prev,

      activities: prev.activities.map((item) =>
        String(item.id) === String(activityId) ? updatedActivity : item,
      ),
    }));

    return updatedActivity;
  };

  // DELETE ACTIVITY

  const removeActivity = async (id) => {
    await deleteActivityApi(id);

    setData((prev) => ({
      ...prev,

      activities: prev.activities.filter(
        (activity) => String(activity.id) !== String(id),
      ),
    }));
  };

  // =================================
  // EXAM CRUD - MONGODB
  // =================================

  // CREATE EXAM

  const addExam = async (exam) => {
    const response = await createExam(exam);

    const savedExam = normalizeRecord(response);

    setData((prev) => ({
      ...prev,

      exams: [savedExam, ...prev.exams],
    }));

    return savedExam;
  };

  // UPDATE EXAM

  const updateExam = async (exam) => {
    const examId = exam.id || exam._id;

    const response = await updateExamApi(examId, exam);

    const updatedExam = normalizeRecord(response);

    setData((prev) => ({
      ...prev,

      exams: prev.exams.map((item) =>
        String(item.id) === String(examId) ? updatedExam : item,
      ),
    }));

    return updatedExam;
  };

  // DELETE EXAM

  const removeExam = async (id) => {
    await deleteExamApi(id);

    setData((prev) => ({
      ...prev,

      exams: prev.exams.filter((exam) => String(exam.id) !== String(id)),
    }));
  };

  // =================================
  // ALL ACTIONS
  // =================================

  const actions = {
    // Student actions
    addStudent,
    updateStudent,
    deleteStudent: removeStudent,

    // Activity actions
    addActivity,
    updateActivity,
    deleteActivity: removeActivity,

    // Exam actions
    addExam,
    updateExam,
    deleteExam: removeExam,
  };

  // =================================
  // PAGE TITLES
  // =================================

  const titles = {
    overview: "Overview",
    students: "Students",
    activities: "Daily Activities",
    exams: "Examination Results",
    reports: "Reports",
  };

  // =================================
  // SHARED PROPS
  // =================================

  const shared = {
    data,
    actions,
    getPoints,
    getExamAverage,
    today,
    currentMonth,
  };

  // =================================
  // RENDER
  // =================================

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar page={page} setPage={setPage} />

      <main className="min-w-0 flex-1">
        <Header title={titles[page]} />

        <div className="p-4 md:p-8">
          {/* LOADING */}

          {loading && <p className="mb-4 text-blue-600">Loading LMS data...</p>}

          {/* ERROR */}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}

              <button className="ml-2 underline" onClick={loadData}>
                Retry
              </button>
            </div>
          )}

          {/* OVERVIEW */}

          {page === "overview" && <Overview {...shared} setPage={setPage} />}

          {/* STUDENTS */}

          {page === "students" && <StudentsList {...shared} />}

          {/* ACTIVITIES */}

          {page === "activities" && <Activities {...shared} />}

          {/* EXAMS */}

          {page === "exams" && (
            <Exams {...shared} students={data.students} exams={data.exams} />
          )}

          {/* REPORTS */}

          {page === "reports" && <Reports {...shared} />}

          <footer className="mt-8 text-center text-xs text-slate-400">
            Campus LMS · Student Performance Management
          </footer>
        </div>
      </main>
    </div>
  );
}
