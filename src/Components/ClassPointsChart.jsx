
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ClassPointsChart({ students = [], activities = [] }) {
  const [period, setPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedMonth, setSelectedMonth] = useState(
    getToday().slice(0, 7)
  );

  const chartData = useMemo(() => {
    // Create a point total for every class
    const totals = {};

    students.forEach((student) => {
      const className = student.className || "Unassigned";
      totals[className] = 0;
    });

    activities.forEach((activity) => {
      const activityDate = activity.date || "";

      const matchesPeriod =
        period === "day"
          ? activityDate === selectedDate
          : activityDate.slice(0, 7) === selectedMonth;

      if (!matchesPeriod) return;

      const student = students.find(
        (item) => String(item.id) === String(activity.studentId)
      );

      if (!student) return;

      const className = student.className || "Unassigned";
      const points = Number(activity.points) || 0;

      totals[className] = (totals[className] || 0) + points;
    });

    return Object.entries(totals).map(([className, points]) => ({
      className,
      points,
    }));
  }, [students, activities, period, selectedDate, selectedMonth]);

  const totalPoints = chartData.reduce(
    (sum, item) => sum + item.points,
    0
  );

  return (
    <div className="rounded-xl border bg-white p-5">
      {/* Heading and period selection */}
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Class-wise Performance
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Activity points earned by each class
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="form-input w-auto"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="month">Month</option>
          </select>

          {period === "day" ? (
            <input
              type="date"
              className="form-input w-auto"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          ) : (
            <input
              type="month"
              className="form-input w-auto"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Total points */}
      <div className="mb-5 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          Total points for selected {period}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-blue-800">
          {totalPoints}
        </h2>
      </div>

      {/* Bar chart */}
      {chartData.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="className"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [`${value} points`, "Points"]}
              />

              <Bar
                dataKey="points"
                name="Points"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-500">
          No student classes available.
        </p>
      )}

      {chartData.length > 0 &&
        chartData.every((item) => item.points === 0) && (
          <p className="mt-2 text-center text-xs text-slate-400">
            No activity points recorded for this period.
          </p>
        )}
    </div>
  );
}

export default ClassPointsChart;
