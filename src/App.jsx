
import { useEffect, useState } from "react";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./api/studentApi";

import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Overview from "./Components/Overview";
import StudentsList from "./Components/StudentsList";
import Activities from "./Components/Activities";
import Exams from "./Components/Exams";
import Reports from "./Components/Reports";

const STORAGE_KEY = "student-performance-lms";

const initialData = {
  students: [],
  activities: [],
  exams: [],
};

// Get today's date in YYYY-MM-DD format
function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function App() {
  // Application data
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (!savedData) return initialData;

      const parsedData = JSON.parse(savedData);

      return {
        ...initialData,
        ...parsedData,
        students: [], // Students will come from MongoDB
      };
    } catch (error) {
      console.error("Error loading saved data:", error);
      return initialData;
    }
  });

  const [page, setPage] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = getToday();
  const currentMonth = today.slice(0, 7);

  // --------------------------------
  // FETCH STUDENTS FROM MONGODB
  // --------------------------------

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const students = await getStudents();

        const formattedStudents = students.map((student) => ({
          ...student,
          id: student._id,
        }));

        setData((prev) => ({
          ...prev,
          students: formattedStudents,
        }));
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // --------------------------------
  // SAVE ACTIVITIES AND EXAMS
  // --------------------------------

  // Students are stored in MongoDB.
  // Activities and exams are temporarily stored in localStorage.

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activities: data.activities,
        exams: data.exams,
      })
    );
  }, [data.activities, data.exams]);

  // --------------------------------
  // ACTIVITY POINT CALCULATION
  // --------------------------------

  const getPoints = (studentId = "", period = "") => {
    return data.activities
      .filter((activity) => {
        const matchesStudent =
          !studentId ||
          String(activity.studentId) === String(studentId);

        const matchesPeriod =
          !period ||
          (period.length === 7
            ? activity.date?.startsWith(period)
            : activity.date === period);

        return matchesStudent && matchesPeriod;
      })
      .reduce(
        (total, activity) =>
          total + (Number(activity.points) || 0),
        0
      );
  };

  // --------------------------------
  // EXAM AVERAGE CALCULATION
  // --------------------------------

  const getExamAverage = (studentId = "") => {
    const results = data.exams.filter(
      (exam) =>
        !studentId ||
        String(exam.studentId) === String(studentId)
    );

    const validResults = results.filter(
      (exam) => Number(exam.total) > 0
    );

    if (!validResults.length) return null;

    const total = validResults.reduce(
      (sum, exam) =>
        sum +
        (Number(exam.marks) / Number(exam.total)) * 100,
      0
    );

    return total / validResults.length;
  };

  // --------------------------------
  // STUDENT CRUD - MONGODB
  // --------------------------------

  // Remove frontend-only IDs before sending data to MongoDB
  const getStudentPayload = (student) => {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    class: student.class,
    admissionNumber: student.admissionNumber,
    email: student.email,
    isActive: student.isActive,
  };
};

  // CREATE STUDENT
  const addStudent = async (student) => {
    const savedStudent = await createStudent(
      getStudentPayload(student)
    );

    setData((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          ...savedStudent,
          id: savedStudent._id,
        },
      ],
    }));
  };

  // UPDATE STUDENT
  const updateStudentData = async (student) => {
    const updatedStudent = await updateStudent(
      student.id,
      getStudentPayload(student)
    );

    setData((prev) => ({
      ...prev,
      students: prev.students.map((item) =>
        item.id === student.id
          ? {
              ...updatedStudent,
              id: updatedStudent._id,
            }
          : item
      ),
    }));
  };

  // DELETE STUDENT
  const removeStudent = async (id) => {
    await deleteStudent(id);

    setData((prev) => ({
      ...prev,
      students: prev.students.filter(
        (student) => student.id !== id
      ),
    }));
  };

  // --------------------------------
  // ACTIVITY CRUD - LOCAL STORAGE
  // --------------------------------

  const addActivity = (activity) => {
    setData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        {
          ...activity,
          id: crypto.randomUUID(),
        },
      ],
    }));
  };

  const updateActivity = (updatedActivity) => {
    setData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.id === updatedActivity.id
          ? updatedActivity
          : activity
      ),
    }));
  };

  const deleteActivity = (id) => {
    setData((prev) => ({
      ...prev,
      activities: prev.activities.filter(
        (activity) => activity.id !== id
      ),
    }));
  };

  // --------------------------------
  // EXAM CRUD - LOCAL STORAGE
  // --------------------------------

  const addExam = (exam) => {
    setData((prev) => ({
      ...prev,
      exams: [
        ...prev.exams,
        {
          ...exam,
          id: crypto.randomUUID(),
        },
      ],
    }));
  };

  const updateExam = (updatedExam) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.map((exam) =>
        exam.id === updatedExam.id
          ? updatedExam
          : exam
      ),
    }));
  };

  const deleteExam = (id) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.filter(
        (exam) => exam.id !== id
      ),
    }));
  };

  // --------------------------------
  // ALL ACTIONS
  // --------------------------------

  const actions = {
    addStudent,
    updateStudent: updateStudentData,
    deleteStudent: removeStudent,

    addActivity,
    updateActivity,
    deleteActivity,

    addExam,
    updateExam,
    deleteExam,
  };

  // --------------------------------
  // SHARED PROPS
  // --------------------------------

  const sharedProps = {
    data,
    actions,
    getPoints,
    getExamAverage,
    today,
    currentMonth,
  };

  // --------------------------------
  // PAGE TITLES
  // --------------------------------

  const titles = {
    overview: "Overview",
    students: "Students",
    activities: "Daily Activities",
    exams: "Examination Results",
    reports: "Reports",
  };

  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="min-w-0 flex-1">

        <Header title={titles[page]} />

        <div className="p-4 md:p-8">

          {loading && (
            <p className="mb-4 text-blue-600">
              Loading students...
            </p>
          )}

          {error && (
            <p className="mb-4 text-red-600">
              {error}
            </p>
          )}

          {page === "overview" && (
            <Overview
              {...sharedProps}
              setPage={setPage}
            />
          )}

          {page === "students" && (
            <StudentsList {...sharedProps} />
          )}

          {page === "activities" && (
            <Activities {...sharedProps} />
          )}

          {page === "exams" && (
            <Exams
              {...sharedProps}
              students={data.students}
              exams={data.exams}
            />
          )}

          {page === "reports" && (
            <Reports {...sharedProps} />
          )}

          <footer className="mt-8 text-center text-xs text-slate-400">
            Campus LMS · Student Performance Management
          </footer>

        </div>
      </main>
    </div>
  );
}
