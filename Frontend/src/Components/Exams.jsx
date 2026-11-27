
import { useMemo, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import ExamForm from "./ExamForm";
import ExamResultsTable from "./ExamResultsTable";

export default function Exams({
  students = [],
  exams = [],
  actions = {},
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");

  // Get unique classes and subjects
  const classes = [
    ...new Set(students.map((s) => s.className).filter(Boolean)),
  ];

  const subjects = [
    ...new Set(exams.map((e) => e.subject).filter(Boolean)),
  ];

  // Prepare exam results
  const results = useMemo(() => {
    return exams.map((exam) => {
      const student = students.find(
        (s) => String(s.id) === String(exam.studentId)
      );

      const marks = Number(exam.marks) || 0;
      const total = Number(exam.total) || 0;

      const percentage =
        total > 0 ? (marks / total) * 100 : 0;

      return {
        ...exam,
        marks,
        total,
        studentName: student?.name || "Unknown Student",
        className: student?.className || "Unknown Class",
        percentage,
      };
    });
  }, [students, exams]);

  // Close form
  const close = () => {
    setShowForm(false);
    setSelectedExam(null);
  };

  // Save exam
  const save = async (exam) => {
    try {
      if (selectedExam) {
        await actions.updateExam({
          ...exam,
          id: selectedExam.id,
        });
      } else {
        await actions.addExam(exam);
      }

      close();
    } catch (error) {
      alert(error.message || "Unable to save exam result");
    }
  };

  // Delete exam
  const remove = async (id) => {
    if (!window.confirm("Delete this exam result?")) return;

    try {
      await actions.deleteExam(id);
    } catch (error) {
      alert(error.message || "Unable to delete exam result");
    }
  };

  // Search, filter and sort
  const filtered = useMemo(() => {
    const list = results.filter((exam) => {
      const matchesClass =
        classFilter === "All" ||
        exam.className === classFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        exam.subject === subjectFilter;

      const searchText =
        `${exam.studentName} ${exam.subject || ""} ${exam.exam || ""}`
          .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      return matchesClass && matchesSubject && matchesSearch;
    });

    return [...list].sort((a, b) => {
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
          return String(b.date || "").localeCompare(
            String(a.date || "")
          );
      }
    });
  }, [results, classFilter, subjectFilter, search, sortBy]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Examination Results
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record and review student examination performance.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExam(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#176B55] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add Exam Result
        </button>
      </div>

      {showForm && (
        <ExamForm
          students={students}
          selectedExam={selectedExam}
          onSave={save}
          onClose={close}
        />
      )}

      <section className="mb-5 rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <h3 className="font-semibold">
            Filter & Sort Results
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="form-input"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-input"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="All">All Classes</option>
            {classes.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

          <select
            className="form-input"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

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
      </section>

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h3 className="font-semibold">Student Results</h3>
          <p className="mt-1 text-xs text-slate-500">
            Showing {filtered.length} results
          </p>
        </div>

        <ExamResultsTable
          results={filtered}
          onEdit={(exam) => {
            setSelectedExam(exam);
            setShowForm(true);
          }}
          onDelete={remove}
        />
      </section>
    </div>
  );
}
