import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const BAR_COLORS = [
  "#176B55", "#2563EB", "#D97706", "#7C3AED", "#DB2777",
  "#0891B2", "#65A30D", "#EA580C", "#4F46E5", "#0F766E",
];

export default function TopPointsChart({
  students = [],
  activities = [],
}) {
  const [selectedClass, setSelectedClass] = useState("All");
  const [period, setPeriod] = useState("month");

  const today = new Date().toLocaleDateString("en-CA");
  const currentMonth = today.slice(0, 7);

  const classes = useMemo(
    () => [...new Set(students.map((s) => String(s.className || "").trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [students]
  );

  const chartData = useMemo(() => {
    return students
      .filter((student) => selectedClass === "All" || String(student.className || "").trim() === selectedClass)
      .map((student) => {
        const points = activities
          .filter((activity) => {
            const sameStudent = String(activity.studentId) === String(student.id);
            const date = String(activity.date || "");
            const inPeriod = period === "day"
              ? date.slice(0, 10) === today
              : date.startsWith(currentMonth);
            return sameStudent && inPeriod;
          })
          .reduce((sum, activity) => sum + (Number(activity.points) || 0), 0);

        return {
          id: student.id,
          name: student.name || "Unknown",
          className: student.className || "Unassigned",
          points,
        };
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map((student, index) => ({
        ...student,
        color: BAR_COLORS[index % BAR_COLORS.length],
      }));
  }, [students, activities, selectedClass, period, today, currentMonth]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-[#173B32]">Top Students Points</h2>
          <p className="mt-1 text-sm text-slate-500">Top 10 students by activity points</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            aria-label="Filter by class"
          >
            <option value="All">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            aria-label="Filter by period"
          >
            <option value="day">Today</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          No student points available for this filter.
        </div>
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 12, left: -15, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip
                formatter={(value) => [`${value} points`, "Points"]}
                labelFormatter={(label) => `Student: ${label}`}
                contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }}
              />
              <Bar dataKey="points" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {chartData.map((student) => (
          <span key={student.id} className="inline-flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: student.color }} />
            {student.name}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">Showing {chartData.length} students · {period === "day" ? "Today" : "This month"}</p>
    </section>
  );
}
