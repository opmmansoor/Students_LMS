import { useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import ExamForm from "./ExamForm";
import ExamResultsTable from "./ExamResultsTable";
export default function Exams({ students = [], exams = [], actions }) {
  const [showForm, setShowForm] = useState(false),
    [selectedExam, setSelectedExam] = useState(null),
    [classFilter, setClassFilter] = useState("All"),
    [subjectFilter, setSubjectFilter] = useState("All"),
    [sortBy, setSortBy] = useState("latest"),
    [search, setSearch] = useState("");
  const classes = [
    ...new Set(students.map((s) => s.className).filter(Boolean)),
  ];
  const subjects = [...new Set(exams.map((e) => e.subject).filter(Boolean))];
  const results = useMemo(
    () =>
      exams.map((e) => {
        const s = students.find((x) => String(x.id) === String(e.studentId));
        const total = Number(e.total) || 0;
        return {
          ...e,
          studentName: s?.name || "Unknown Student",
          className: s?.className || "Unknown Class",
          percentage: total ? (Number(e.marks) / total) * 100 : 0,
        };
      }),
    [students, exams],
  );
  const close = () => {
    setShowForm(false);
    setSelectedExam(null);
  };
  const save = async (exam) => {
    if (selectedExam)
      await actions.updateExam({ ...exam, id: selectedExam.id });
    else await actions.addExam(exam);
    close();
  };
  const remove = async (id) => {
    if (window.confirm("Delete this exam result?"))
      try {
        await actions.deleteExam(id);
      } catch (error) {
        alert(error.message || "Unable to delete exam result");
      }
  };
  const filtered = useMemo(() => {
    let list = results.filter(
      (e) =>
        (classFilter === "All" || e.className === classFilter) &&
        (subjectFilter === "All" || e.subject === subjectFilter) &&
        `${e.studentName} ${e.subject} ${e.exam}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
    return list.sort((a, b) =>
      sortBy === "highest"
        ? b.marks - a.marks
        : sortBy === "lowest"
          ? a.marks - b.marks
          : sortBy === "percentage-high"
            ? b.percentage - a.percentage
            : sortBy === "percentage-low"
              ? a.percentage - b.percentage
              : String(b.date).localeCompare(String(a.date)),
    );
  }, [results, classFilter, subjectFilter, search, sortBy]);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Examination Results</h1>
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
          <h3 className="font-semibold">Filter & Sort Results</h3>
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
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            className="form-input"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((x) => (
              <option key={x}>{x}</option>
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
          onEdit={(e) => {
            setSelectedExam(e);
            setShowForm(true);
          }}
          onDelete={remove}
        />
      </section>
    </div>
  );
}
