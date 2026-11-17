
import { useEffect, useState } from "react";

const initialForm = () => ({
  studentId: "",
  exam: "Monthly Test",
  subject: "",
  date: new Date().toLocaleDateString("en-CA"),
  marks: "",
  total: 100,
  remark: "",
});

export default function ExamForm({
  students,
  selectedExam,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(
      selectedExam
        ? { ...selectedExam }
        : initialForm()
    );
  }, [selectedExam]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const marks = Number(form.marks);
    const total = Number(form.total);

    if (
      !form.studentId ||
      form.marks === "" ||
      !Number.isFinite(marks) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      marks < 0 ||
      marks > total
    ) {
      alert("Please enter valid examination marks.");
      return;
    }

    onSave({
      ...form,
      marks,
      total,
    });

    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500";

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="mb-5 text-lg font-bold text-slate-800">
        {selectedExam ? "Edit Exam Result" : "Add Exam Result"}
      </h2>

      {students.length === 0 ? (
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
          Add students before entering examination marks.
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
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Exam Name</label>

            <input
              name="exam"
              value={form.exam}
              onChange={handleChange}
              placeholder="Monthly Test"
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Subject *</label>

            <input
              required
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Mathematics"
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Exam Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Marks Obtained *</label>

            <input
              type="number"
              min="0"
              step="0.5"
              required
              name="marks"
              value={form.marks}
              onChange={handleChange}
              placeholder="85"
              className={inputClass}
            />
          </div>

          <div>
            <label className="form-label">Total Marks *</label>

            <input
              type="number"
              min="1"
              required
              name="total"
              value={form.total}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="form-label">Teacher Remarks</label>

            <input
              name="remark"
              value={form.remark}
              onChange={handleChange}
              placeholder="Optional feedback"
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
              className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
            >
              {selectedExam ? "Update Result" : "Save Result"}
            </button>

          </div>

        </form>
      )}

    </section>
  );
}
