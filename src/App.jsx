
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

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || initialData;
    } catch {
      return initialData;
    }
  });

  const [page, setPage] = useState("overview");

  const today = getToday();
  const currentMonth = today.slice(0, 7);

  // Save data automatically
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }, [data]);

  // Calculate activity points
  const getPoints = (studentId = "", period = "") => {
    return data.activities
      .filter((activity) => {
        const matchesStudent =
          !studentId || activity.studentId === studentId;

        const matchesPeriod =
          !period ||
          (period.length === 7
            ? activity.date.startsWith(period)
            : activity.date === period);

        return matchesStudent && matchesPeriod;
      })
      .reduce(
        (total, activity) =>
          total + Number(activity.points),
        0
      );
  };

  // Calculate exam average
  const getExamAverage = (studentId = "") => {
    const results = data.exams.filter(
      (exam) =>
        !studentId || exam.studentId === studentId
    );

    if (!results.length) return null;

    const total = results.reduce(
      (sum, exam) =>
        sum + (Number(exam.marks) / Number(exam.total)) * 100,
      0
    );

    return total / results.length;
  };

  // Student CRUD
  const addStudent = (student) => {
    setData((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        { ...student, id: crypto.randomUUID() },
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
        (activity) => activity.studentId !== id
      ),
      exams: prev.exams.filter(
        (exam) => exam.studentId !== id
      ),
    }));
  };

  // Activity CRUD
  const addActivity = (activity) => {
    setData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        { ...activity, id: crypto.randomUUID() },
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

  // Exam CRUD
  const addExam = (exam) => {
    setData((prev) => ({
      ...prev,
      exams: [
        ...prev.exams,
        { ...exam, id: crypto.randomUUID() },
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

  const sharedProps = {
    data,
    actions,
    getPoints,
    getExamAverage,
    today,
    currentMonth,
  };

  const titles = {
    overview: "Overview",
    students: "Students",
    activities: "Daily Activities",
    exams: "Exam Marks",
    reports: "Reports",
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="min-w-0 flex-1">

        <Header title={titles[page]} />

        <div className="p-4 md:p-8">

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
            <Exams {...sharedProps} />
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
