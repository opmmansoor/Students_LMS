import { Pencil, Trash2 } from "lucide-react";

export default function ActivityTable({
  activities = [],
  students = [],
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-[#F1F5F3] text-xs uppercase tracking-wide text-[#365B50]">
          <tr>
            <th className="p-3">Completed</th>
            <th className="p-3">Date</th>
            <th className="p-3">Student</th>
            <th className="p-3">Category</th>
            <th className="p-3">Activity / Task</th>
            <th className="p-3">Points</th>
            <th className="p-3">Teacher</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {activities.map((activity) => {
            const student = students.find((item) => String(item.id) === String(activity.studentId));
            const completed = Boolean(activity.completed);

            return (
              <tr key={activity.id} className={`transition-colors hover:bg-slate-50 ${completed ? "bg-emerald-50/40" : ""}`}>
                <td className="p-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => onToggleComplete(activity)}
                      className="h-4 w-4 cursor-pointer accent-emerald-700"
                      aria-label={`Mark ${activity.description} as ${completed ? "pending" : "completed"}`}
                    />
                    <span className={`text-xs font-semibold ${completed ? "text-emerald-700" : "text-amber-700"}`}>
                      {completed ? "Done" : "Pending"}
                    </span>
                  </label>
                </td>
                <td className="whitespace-nowrap p-3 text-slate-600">{activity.date}</td>
                <td className="p-3 font-semibold text-slate-800">{student?.name || "Unknown"}</td>
                <td className="p-3 text-slate-600">{activity.category}</td>
                <td className={`max-w-56 whitespace-normal p-3 ${completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {activity.description}
                  {activity.note && <p className="mt-1 text-xs text-slate-400 no-underline">{activity.note}</p>}
                </td>
                <td className={`p-3 font-bold ${Number(activity.points) >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {Number(activity.points) > 0 ? "+" : ""}{activity.points}
                </td>
                <td className="p-3 text-slate-600">{activity.teacher || "—"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(activity)} className="rounded-md bg-blue-50 p-2 text-blue-700 hover:bg-blue-100" aria-label="Edit activity">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(activity.id)} className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100" aria-label="Delete activity">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {activities.length === 0 && (
            <tr><td colSpan="8" className="p-8 text-center text-slate-400">No activities found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
