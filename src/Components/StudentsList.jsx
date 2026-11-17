
import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import StudentForm from "./StudentForm";

export default function StudentsList({
  data,
  actions,
  getPoints,
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const classes = [
    ...new Set(
      data.students.map((s) => s.className).filter(Boolean)
    ),
  ];

  const filteredStudents = data.students.filter((student) => {
    const matchesSearch =
      `${student.name} ${student.code} ${student.className}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesClass =
      !classFilter || student.className === classFilter;

    return matchesSearch && matchesClass;
  });

  const openEdit = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleSave = (student) => {
    if (selectedStudent) {
      actions.updateStudent({
        ...student,
        id: selectedStudent.id,
      });
    } else {
      actions.addStudent(student);
    }

    setSelectedStudent(null);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Delete this student and all related records?"
      )
    ) {
      actions.deleteStudent(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };

  return (
    <div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#14213d]">
            Student Directory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student profiles and personal performance.
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
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex flex-wrap gap-3">

          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={17} className="text-slate-400" />

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
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All Classes</option>

            {classes.map((className) => (
              <option key={className}>
                {className}
              </option>
            ))}
          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">ID</th>
                <th className="p-3">Class</th>
                <th className="p-3">Discipline</th>
                <th className="p-3">Attitude</th>
                <th className="p-3">Points</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="p-3 font-semibold text-slate-700">
                    {student.name}
                  </td>

                  <td className="p-3 text-slate-500">
                    {student.code}
                  </td>

                  <td className="p-3">
                    {student.className}
                  </td>

                  <td className="p-3">
                    {student.discipline}/5
                  </td>

                  <td className="p-3">
                    {student.attitude}/5
                  </td>

                  <td className="p-3 font-bold text-blue-700">
                    {getPoints(student.id)}
                  </td>

                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {student.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">

                      <button
                        onClick={() => openEdit(student)}
                        className="rounded-md bg-blue-50 p-2 text-blue-700"
                        aria-label="Edit student"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
                        className="rounded-md bg-red-50 p-2 text-red-600"
                        aria-label="Delete student"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-slate-400"
                  >
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
