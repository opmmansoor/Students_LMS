import { useEffect, useState } from "react";
import { X } from "lucide-react";
const emptyForm = {
  name: "",
  code: "",
  className: "",
  discipline: 3,
  attitude: 3,
  status: "Active",
};
export default function StudentForm({ selectedStudent, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  useEffect(
    () => setForm(selectedStudent ? { ...selectedStudent } : emptyForm),
    [selectedStudent],
  );
  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: ["discipline", "attitude"].includes(name) ? Number(value) : value,
    }));
  };
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        code: form.code.trim() || `STU-${Date.now()}`,
        className: form.className.trim(),
      });
      onClose();
    } catch (err) {
      alert(err.message || "Unable to save student");
    } finally {
      setSaving(false);
    }
  };
  const fields = "form-input";
  return (
    <div className="mb-6 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex justify-between">
        <h2 className="text-lg font-bold">
          {selectedStudent ? "Edit Student" : "Register New Student"}
        </h2>
        <button type="button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <form
        onSubmit={submit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          ["name", "Full Name *", "text"],
          ["code", "Student ID", "text"],
          ["className", "Class / Grade *", "text"],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label className="form-label">{label}</label>
            <input
              className={fields}
              required={name !== "code"}
              name={name}
              value={form[name]}
              onChange={change}
            />
          </div>
        ))}
       {[
  ["discipline", "Discipline"],
  ["attitude", "Attitude"],
].map(([name, label]) => (
  <div key={name}>
    <label className="form-label">{label}</label>

    <select
      className={fields}
      name={name}
      value={form[name]}
      onChange={change}
    >
      <option value={1}>1 - Very Poor</option>
      <option value={2}>2 - Poor</option>
      <option value={3}>3 - Average</option>
      <option value={4}>4 - Good</option>
      <option value={5}>5 - Excellent</option>
    </select>
  </div>
))}
        <div>
          <label className="form-label">Status</label>
          <select
            className={fields}
            name="status"
            value={form.status}
            onChange={change}
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
            className="rounded-lg bg-slate-100 px-5 py-2"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="rounded-lg bg-blue-700 px-5 py-2 text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : selectedStudent
                ? "Update Student"
                : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
