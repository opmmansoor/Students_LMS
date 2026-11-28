import { useMemo, useState } from "react";
import { Plus, SlidersHorizontal, Search } from "lucide-react";

import ExamForm from "./ExamForm";
import ExamResultsTable from "./ExamResultsTable";

export default function Exams({ students = [], exams = [], actions = {} }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");

  const [saving, setSaving] = useState(false);

  const getStudentId = (student) => String(student.id || student._id || "");

  const getStudentName = (student) =>
    student?.name ||
    `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
    "Unknown Student";

  const classes = useMemo(
    () => [
      ...new Set(
        students
          .map((student) => student.className || student.class)
          .filter(Boolean),
      ),
    ],
    [students],
  );

  const subjects = useMemo(
    () => [...new Set(exams.map((exam) => exam.subject).filter(Boolean))],
    [exams],
  );

  // Attach student information to each exam
  const results = useMemo(() => {
    return exams.map((exam) => {
      const studentId =
        typeof exam.studentId === "object"
          ? exam.studentId?._id
          : exam.studentId;

      const student = students.find(
        (item) => getStudentId(item) === String(studentId),
      );

      const marks = Number(exam.marks) || 0;
      const total = Number(exam.total) || 0;

      const percentage = total > 0 ? (marks / total) * 100 : 0;

      return {
        ...exam,
        id: exam.id || exam._id,
        studentId,
        examName: exam.examName || exam.exam || "",
        studentName: getStudentName(student),
        className: student?.className || student?.class || "Unknown Class",
        marks,
        total,
        percentage,
      };
    });
  }, [students, exams]);

  const closeForm = () => {
    setShowForm(false);
    setSelectedExam(null);
  };

  // Save or update exam

  const handleSave = async (exam) => {
    try {
      if (!actions) {
        throw new Error("Exam actions are missing");
      }

      if (selectedExam) {
        await actions.updateExam({
          ...exam,
          id: selectedExam.id || selectedExam._id,
        });
      } else {
        await actions.addExam(exam);
      }

      closeForm();
    } catch (error) {
      console.error("Exam save error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to save exam result",
      );
    }
  };

  // Delete exam
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam result?")) return;

    try {
      await actions.deleteExam(id);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete exam result",
      );
    }
  };

  // Search, filter and sort
  const filteredResults = useMemo(() => {
    const filtered = results.filter((exam) => {
      const matchesClass =
        classFilter === "All" || exam.className === classFilter;

      const matchesSubject =
        subjectFilter === "All" || exam.subject === subjectFilter;

      const searchText = [exam.studentName, exam.subject, exam.examName]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());

      return matchesClass && matchesSubject && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.marks - a.marks;

        case "lowest":
          return a.marks - b.marks;

        case "percentage-high":
          return b.percentage - a.percentage;

        case "percentage-low":
          return a.percentage - b.percentage;

        default:
          return String(b.date || "").localeCompare(String(a.date || ""));
      }
    });
  }, [results, classFilter, subjectFilter, search, sortBy]);

  const averagePercentage =
    filteredResults.length > 0
      ? filteredResults.reduce((sum, exam) => sum + exam.percentage, 0) /
        filteredResults.length
      : 0;

  const passedCount = filteredResults.filter(
    (exam) => exam.percentage >= 40,
  ).length;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Examination Results
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record and review student examination performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedExam(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#176B55] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add Exam Result
        </button>
      </div>

      {/* Exam Form */}
      {showForm && (
        <ExamForm
          students={students}
          selectedExam={selectedExam}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Total Results</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            {filteredResults.length}
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Average Percentage</p>
          <h3 className="mt-2 text-2xl font-bold text-[#176B55]">
            {averagePercentage.toFixed(1)}%
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Passed Results</p>
          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {passedCount}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <h3 className="font-semibold">Filter & Sort Results</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="form-label">Search</label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                className="form-input pl-9"
                placeholder="Search student or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Class</label>

            <select
              className="form-input"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All">All Classes</option>

              {classes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Subject</label>

            <select
              className="form-input"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All Subjects</option>

              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Sort By</label>

            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest Exam</option>
              <option value="highest">Highest Marks</option>
              <option value="lowest">Lowest Marks</option>
              <option value="percentage-high">Highest Percentage</option>
              <option value="percentage-low">Lowest Percentage</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h3 className="font-semibold">Student Results</h3>

          <p className="mt-1 text-xs text-slate-500">
            Showing {filteredResults.length} results
          </p>
        </div>

        <ExamResultsTable
          results={filteredResults}
          onEdit={(exam) => {
            setSelectedExam(exam);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}
