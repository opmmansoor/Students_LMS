import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import StudentForm from "./StudentForm";
export default function StudentsList({ data, actions, getPoints }) {
  const [showForm, setShowForm] = useState(false),
    [selectedStudent, setSelectedStudent] = useState(null),
    [search, setSearch] = useState(""),
    [classFilter, setClassFilter] = useState("");
  const classes = [
    ...new Set(data.students.map((s) => s.className).filter(Boolean)),
  ];
  const filtered = data.students.filter(
    (s) =>
      `${s.name} ${s.code} ${s.className}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!classFilter || s.className === classFilter),
  );
  const close = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };
  const save = async (s) => {
    if (selectedStudent)
      await actions.updateStudent({ ...s, id: selectedStudent.id });
    else await actions.addStudent(s);
  };
  const remove = async (id) => {
    if (window.confirm("Delete this student and all related records?"))
      try {
        await actions.deleteStudent(id);
      } catch (e) {
        alert(e.message);
      }
  };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage student profiles and performance.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add Student
        </button>
      </div>
      {showForm && (
        <StudentForm
          selectedStudent={selectedStudent}
          onSave={save}
          onClose={close}
        />
      )}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border px-3">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full py-2.5 text-sm outline-none"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {[
                  "Student",
                  "ID",
                  "Class",
                  "Discipline",
                  "Attitude",
                  "Points",
                  "Status",
                  "Actions",
                ].map((x) => (
                  <th className="p-3" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.className}</td>
                  <td className="p-3">{s.discipline}/5</td>
                  <td className="p-3">{s.attitude}/5</td>
                  <td className="p-3 font-bold text-blue-700">
                    {getPoints(s.id)}
                  </td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowForm(true);
                        }}
                        className="rounded-md bg-blue-50 p-2 text-blue-700"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="rounded-md bg-red-50 p-2 text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
