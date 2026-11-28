import { useEffect, useState } from "react";

const getToday = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const initialForm = () => ({
  studentId: "",
  examName: "Monthly Test",
  subject: "",
  date: getToday(),
  marks: "",
  total: 100,
  remark: "",
});

export default function ExamForm({
  students = [],
  selectedExam,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedExam) {
      setForm({
        ...initialForm(),
        ...selectedExam,
        studentId:
          typeof selectedExam.studentId === "object"
            ? selectedExam.studentId?._id
            : selectedExam.studentId,
        examName: selectedExam.examName || selectedExam.exam || "Monthly Test",
        date: selectedExam.date
          ? String(selectedExam.date).slice(0, 10)
          : getToday(),
      });
    } else {
      setForm(initialForm());
    }

    setError("");
  }, [selectedExam]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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

    try {
      await onSave({
        ...form,
        marks,
        total,
      });

      onClose();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to save exam result",
      );
    }
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
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 sm:col-span-2 lg:col-span-3">
              {error}
            </div>
          )}

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

              {students.map((student) => {
                const id = student.id || student._id;
                const name =
                  student.name ||
                  `${student.firstName || ""} ${student.lastName || ""}`.trim();

                return (
                  <option key={id} value={id}>
                    {name || "Unnamed Student"}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="form-label">Exam Name *</label>

            <input
              required
              name="examName"
              value={form.examName}
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
              step="0.5"
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
              disabled={saving}
              className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : selectedExam
                  ? "Update Result"
                  : "Save Result"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
