import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import ActivityForm from "./ActivityForm";
import ActivityTable from "./ActivityTable";
export default function Activities({
  data,
  actions,
  getPoints,
  today,
  currentMonth,
}) {
  const [showForm, setShowForm] = useState(false),
    [selectedActivity, setSelectedActivity] = useState(null),
    [search, setSearch] = useState(""),
    [dateFilter, setDateFilter] = useState(""),
    [monthFilter, setMonthFilter] = useState("");
  const filtered = useMemo(
    () =>
      data.activities
        .filter((a) => {
          const s = data.students.find(
            (x) => String(x.id) === String(a.studentId),
          );
          const term =
            `${s?.name || ""} ${a.category || ""} ${a.description || ""}`.toLowerCase();
          return (
            term.includes(search.toLowerCase()) &&
            (!dateFilter || String(a.date).slice(0, 10) === dateFilter) &&
            (!monthFilter || String(a.date).slice(0, 7) === monthFilter)
          );
        })
        .sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [data, search, dateFilter, monthFilter],
  );
  const save = async (activity) => {
    if (selectedActivity)
      await actions.updateActivity({ ...activity, id: selectedActivity.id });
    else await actions.addActivity(activity);
  };
  const close = () => {
    setShowForm(false);
    setSelectedActivity(null);
  };
  const remove = async (id) => {
    if (window.confirm("Delete this activity?"))
      try {
        await actions.deleteActivity(id);
      } catch (e) {
        alert(e.message);
      }
  };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daily Activity Register</h1>
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
          onSave={save}
          onClose={close}
        />
      )}
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Daily Activity Points</p>
          <h2 className="mt-2 text-3xl font-bold text-[#176B55]">
            {getPoints("", dateFilter || today)}
          </h2>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Monthly Activity Points</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-700">
            {getPoints("", monthFilter || currentMonth)}
          </h2>
        </div>
      </div>
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border px-3">
            <Search size={17} />
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
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <ActivityTable
          activities={filtered}
          students={data.students}
          onToggleComplete={(a) =>
            actions.updateActivity({ ...a, completed: !a.completed })
          }
          onEdit={(a) => {
            setSelectedActivity(a);
            setShowForm(true);
          }}
          onDelete={remove}
        />
      </section>
    </div>
  );
}
