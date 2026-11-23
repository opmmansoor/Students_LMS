
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import ActivityForm from "./ActivityForm";
import ActivityTable from "./ActivityTable";

export default function Activities({
  data,
  actions,
  getPoints,
  today,
  currentMonth,
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const filteredActivities = data.activities
    .filter((activity) => {
      const student = data.students.find(
        (s) => s.id === activity.studentId
      );

      const matchesSearch =
        `${student?.name || ""} ${activity.category} ${activity.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDate =
        !dateFilter || activity.date === dateFilter;

      const matchesMonth =
        !monthFilter || activity.date.startsWith(monthFilter);

      return matchesSearch && matchesDate && matchesMonth;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleSave = (activity) => {
    if (selectedActivity) {
      actions.updateActivity({
        ...activity,
        id: selectedActivity.id,
      });
    } else {
      actions.addActivity(activity);
    }

    setSelectedActivity(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this activity?")) {
      actions.deleteActivity(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedActivity(null);
  };

  const editActivity = (activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  return (
    <div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#14213d]">
            Daily Activity Register
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor student behaviour and daily performance.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedActivity(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#176B55] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add Activity
        </button>

      </div>

      {showForm && (
        <ActivityForm
          students={data.students}
          selectedActivity={selectedActivity}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Daily Activity Points
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#176B55]">
            {getPoints("", dateFilter || today)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Monthly Activity Points
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-700">
            {getPoints("", monthFilter || currentMonth)}
          </h2>
        </div>

      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 font-bold text-slate-800">
          Activity Records
        </h2>

        <div className="mb-5 flex flex-wrap gap-3">

          <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={17} className="text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or activity..."
              className="w-full py-2.5 text-sm outline-none"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

        </div>

        <ActivityTable
          activities={filteredActivities}
          students={data.students}
          onToggleComplete={(activity) =>
            actions.updateActivity({
              ...activity,
              completed: !activity.completed,
            })
          }
          onEdit={editActivity}
          onDelete={handleDelete}
        />

      </section>

    </div>
  );
}
