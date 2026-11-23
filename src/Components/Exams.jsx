
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Pencil,
} from "lucide-react";

import ExamForm from "./ExamForm";
import ExamResultsTable from "./ExamResultsTable";

function Exams({ students = [], exams = [], actions }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");

  // Unique classes
  const classes = [
    ...new Set(
      students.map((student) => student.className).filter(Boolean)
    ),
  ];

  // Unique subjects
  const subjects = [
    ...new Set(
      exams.map((exam) => exam.subject).filter(Boolean)
    ),
  ];

  // Add student details to exam results
  const results = useMemo(() => {
    return exams.map((exam) => {
      const student = students.find(
        (item) => String(item.id) === String(exam.studentId)
      );

      const marks = Number(exam.marks) || 0;
      const total = Number(exam.total) || 0;

      const percentage =
        total > 0 ? (marks / total) * 100 : 0;

      return {
        ...exam,
        studentName: student?.name || "Unknown Student",
        className: student?.className || "Unknown Class",
        percentage,
      };
    });
  }, [students, exams]);

  // Save exam result
  const handleSave = (exam) => {
    if (!actions) {
      console.error("Exam actions were not passed to Exams component");
      return;
    }

    if (selectedExam) {
      actions.updateExam({
        ...exam,
        id: selectedExam.id,
      });
    } else {
      actions.addExam(exam);
    }

    closeForm();
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setSelectedExam(null);
  };

  // Open edit form
  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setShowForm(true);
  };

  // Filter and sort
  const filteredResults = useMemo(() => {
    let data = results.filter((exam) => {
      const matchesClass =
        classFilter === "All" ||
        exam.className === classFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        exam.subject === subjectFilter;

      const matchesSearch =
        exam.studentName
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesClass &&
        matchesSubject &&
        matchesSearch
      );
    });

    if (sortBy === "highest") {
      data.sort((a, b) => b.marks - a.marks);
    } else if (sortBy === "lowest") {
      data.sort((a, b) => a.marks - b.marks);
    } else if (sortBy === "percentage-high") {
      data.sort((a, b) => b.percentage - a.percentage);
    } else if (sortBy === "percentage-low") {
      data.sort((a, b) => a.percentage - b.percentage);
    } else {
      data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    return data;
  }, [
    results,
    classFilter,
    subjectFilter,
    sortBy,
    search,
  ]);

  const averagePercentage =
    filteredResults.length > 0
      ? filteredResults.reduce(
          (sum, exam) => sum + exam.percentage,
          0
        ) / filteredResults.length
      : 0;

  const passedCount = filteredResults.filter(
    (exam) => exam.percentage >= 35
  ).length;

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Examination Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View, filter and compare student examination performance.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExam(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#176B55] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125642]"
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
          <p className="text-sm text-slate-500">
            Total Results
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            {filteredResults.length}
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Average Percentage
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[#176B55]">
            {averagePercentage.toFixed(1)}%
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Passed Results
          </p>
          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {passedCount}
          </h3>
        </div>

      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-white p-5">

        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-[#176B55]"
          />

          <h3 className="font-semibold text-slate-800">
            Filter & Sort Results
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Search */}
          <div>
            <label className="form-label">
              Search Student
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                className="form-input pl-9"
                placeholder="Student name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Class Filter */}
          <div>
            <label className="form-label">
              Filter by Class
            </label>

            <select
              className="form-input"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All">All Classes</option>

              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="form-label">
              Filter by Subject
            </label>

            <select
              className="form-input"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All Subjects</option>

              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="form-label">
              Sort Results
            </label>

            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest Exam</option>
              <option value="highest">Highest Marks</option>
              <option value="lowest">Lowest Marks</option>
              <option value="percentage-high">
                Highest Percentage
              </option>
              <option value="percentage-low">
                Lowest Percentage
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border bg-white">

        <div className="border-b p-5">
          <h3 className="font-semibold text-slate-800">
            Student Results
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Showing {filteredResults.length} results
          </p>
        </div>

        <ExamResultsTable
          results={filteredResults}
          onEdit={handleEdit}
        />
      </div>

    </div>
  );
}

export default Exams;
