
import { useEffect, useState } from "react";

const categories = [
  "Class participation",
  "Discipline",
  "Respect and attitude",
  "Homework completion",
  "Attendance / punctuality",
  "Leadership",
  "Qirath",
  "Helping others",
  "Swalath",
  "Niskaram",
  "Other",
];

const initialForm = () => ({
  studentId: "",
  date: new Date().toLocaleDateString("en-CA"),
  category: "Class participation",
  description: "",
  points: 2,
  teacher: "",
  note: "",
});

export default function ActivityForm({
  students,
  selectedActivity,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(
      selectedActivity
        ? { ...selectedActivity }
        : initialForm()
    );
  }, [selectedActivity]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.studentId || !form.description.trim()) {
      return;
    }

    onSave({
      ...form,
      points: Number(form.points),
      description: form.description.trim(),
    });

    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500";

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="mb-5 text-lg font-bold text-slate-800">
        {selectedActivity ? "Edit Activity" : "Record Daily Activity"}
      </h2>

      {students.length === 0 ? (
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
          Add students before recording activities.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >

          <div>
            <label className="form-label">Student *</label>

            <select
              required
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Activity Date</label>

            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Activity Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">
              Description / Observation *
            </label>

            <input
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe student activity..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">
              Points (+ or -)
            </label>

            <input
              type="number"
              name="points"
              value={form.points}
              onChange={handleChange}
              required
              className={inputClass}
            />

            <p className="mt-1 text-xs text-slate-400">
              Example: +5 or -3
            </p>
          </div>

          <div>
            <label className="form-label">Teacher Name</label>

            <input
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              placeholder="Teacher name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Additional Note</label>

            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Optional note"
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 sm:col-span-2 lg:col-span-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {selectedActivity ? "Update Activity" : "Save Activity"}
            </button>

          </div>

        </form>
      )}
    </section>
  );
}
