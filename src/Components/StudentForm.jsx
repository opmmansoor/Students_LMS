
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  code: "",
  className: "",
  discipline: 3,
  attitude: 3,
  status: "Active",
};

export default function StudentForm({
  selectedStudent,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (selectedStudent) {
      setForm({ ...selectedStudent });
    } else {
      setForm(initialForm);
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "discipline" || name === "attitude"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    onSave({
      ...form,
      code: form.code.trim() || `STU-${Date.now().toString().slice(-5)}`,
      name: form.name.trim(),
    });

    onClose();
  };

  return (
    <div className="mb-6 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-bold text-slate-800">
          {selectedStudent ? "Edit Student" : "Register New Student"}
        </h2>

        <button onClick={onClose} className="text-slate-400 hover:text-red-500">
          <X size={20} />
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >

        <div>
          <label className="form-label">Full Name *</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student name"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Student ID</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="STU-001"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Class / Grade</label>
          <input
            name="className"
            value={form.className}
            onChange={handleChange}
            placeholder="Grade 8"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Discipline</label>
          <select
            name="discipline"
            value={form.discipline}
            onChange={handleChange}
            className="form-input"
          >
            <option value={1}>1 - Needs support</option>
            <option value={2}>2 - Developing</option>
            <option value={3}>3 - Satisfactory</option>
            <option value={4}>4 - Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>

        <div>
          <label className="form-label">Attitude</label>
          <select
            name="attitude"
            value={form.attitude}
            onChange={handleChange}
            className="form-input"
          >
            <option value={1}>1 - Needs support</option>
            <option value={2}>2 - Developing</option>
            <option value={3}>3 - Satisfactory</option>
            <option value={4}>4 - Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>

        <div>
          <label className="form-label">Student Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-input"
          >
            <option>Active</option>
            <option>TC</option>
            <option>Needs attention</option>
          </select>
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
            {selectedStudent ? "Update Student" : "Save Student"}
          </button>

        </div>

      </form>
    </div>
  );
}
