
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import ActivityForm from "./ActivityForm";

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
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
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

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {getPoints("", dateFilter || today)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Monthly Activity Points
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
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

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Student</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Points</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredActivities.map((activity) => {
                const student = data.students.find(
                  (s) => s.id === activity.studentId
                );

                return (
                  <tr
                    key={activity.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="p-3">
                      {activity.date}
                    </td>

                    <td className="p-3 font-semibold">
                      {student?.name || "Unknown"}
                    </td>

                    <td className="p-3">
                      {activity.category}
                    </td>

                    <td className="max-w-48 whitespace-normal p-3">
                      {activity.description}

                      {activity.note && (
                        <p className="text-xs text-slate-400">
                          {activity.note}
                        </p>
                      )}
                    </td>

                    <td className={`p-3 font-bold ${
                      Number(activity.points) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {Number(activity.points) > 0 ? "+" : ""}
                      {activity.points}
                    </td>

                    <td className="p-3">
                      {activity.teacher || "—"}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">

                        <button
                          onClick={() => editActivity(activity)}
                          className="rounded-md bg-blue-50 p-2 text-blue-700"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="rounded-md bg-red-50 p-2 text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredActivities.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-400"
                  >
                    No activities found.
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
