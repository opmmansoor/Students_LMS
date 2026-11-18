
import { useEffect, useState } from "react";

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
  // Main application data
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (!savedData) return initialData;

      const parsedData = JSON.parse(savedData);

      return {
        ...initialData,
        ...parsedData,
      };
    } catch (error) {
      console.error("Error loading saved data:", error);
      return initialData;
    }
  });

  // Current page
  const [page, setPage] = useState("overview");

  const today = getToday();
  const currentMonth = today.slice(0, 7);

  // Save application data automatically
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }, [data]);

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
  // STUDENT CRUD
  // --------------------------------

  const addStudent = (student) => {
    setData((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          ...student,
          id: crypto.randomUUID(),
        },
      ],
    }));
  };

  const updateStudent = (updatedStudent) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      ),
    }));
  };

  const deleteStudent = (id) => {
    setData((prev) => ({
      ...prev,

      students: prev.students.filter(
        (student) => student.id !== id
      ),

      activities: prev.activities.filter(
        (activity) =>
          String(activity.studentId) !== String(id)
      ),

      exams: prev.exams.filter(
        (exam) =>
          String(exam.studentId) !== String(id)
      ),
    }));
  };

  // --------------------------------
  // ACTIVITY CRUD
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
  // EXAM CRUD
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
    updateStudent,
    deleteStudent,

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

      {/* Sidebar */}
      <Sidebar
        page={page}
        setPage={setPage}
      />

      {/* Main Content */}
      <main className="min-w-0 flex-1">

        {/* Header */}
        <Header title={titles[page]} />

        <div className="p-4 md:p-8">

          {/* Overview */}
          {page === "overview" && (
            <Overview
              {...sharedProps}
              setPage={setPage}
            />
          )}

          {/* Students */}
          {page === "students" && (
            <StudentsList
              {...sharedProps}
            />
          )}

          {/* Activities */}
          {page === "activities" && (
            <Activities
              {...sharedProps}
            />
          )}

          {/* Examination Results */}
          {page === "exams" && (
            <Exams
              {...sharedProps}
              students={data.students}
              exams={data.exams}
            />
          )}

          {/* Reports */}
          {page === "reports" && (
            <Reports
              {...sharedProps}
            />
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-slate-400">
            Campus LMS · Student Performance Management
          </footer>

        </div>
      </main>
    </div>
  );
}
