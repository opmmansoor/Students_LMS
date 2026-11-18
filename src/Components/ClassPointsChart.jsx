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

function ClassPointsChart({ students = [], activities = [] }) {
  const [period, setPeriod] = useState("month");
  const [selectedClass, setSelectedClass] = useState("All");

  // Current date
  const today = new Date().toLocaleDateString("en-CA");
  const currentMonth = today.slice(0, 7);

  // Colors based on class
  const classColors = [
    "#3D348B", // Purple
    "#219EBC", // Blue
    "#2A9D8F", // Green
    "#F4A261", // Orange
    "#E76F51", // Red
    "#7209B7", // Violet
    "#457B9D", // Steel Blue
    "#D62828", // Dark Red
  ];

  // Get unique classes
  const classes = useMemo(() => {
    const uniqueClasses = [
      ...new Set(
        students
          .map((student) => String(student.class ?? "").trim())
          .filter(Boolean),
      ),
    ];

    return uniqueClasses.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [students]);

  // Create class color mapping
  const classColorMap = useMemo(() => {
    return Object.fromEntries(
      classes.map((cls, index) => [
        cls,
        classColors[index % classColors.length],
      ]),
    );
  }, [classes]);

  // Filter students based on selected class
  const filteredStudents = useMemo(() => {
    if (selectedClass === "All" ) {
      return students;
    }

    return students.filter(
      (student) => String(student.class ?? "").trim() === selectedClass,
    );
  }, [students, selectedClass]);

  // Calculate points for each student
  const chartData = useMemo(() => {
    return (
      filteredStudents
        .map((student) => {
          const points = activities
            .filter((activity) => {
              const sameStudent =
                String(activity.studentId) === String(student.id);

              const activityDate = String(activity.date ?? "");

              const samePeriod =
                period === "day"
                  ? activityDate.slice(0, 10) === today
                  : activityDate.startsWith(currentMonth);

              return sameStudent && samePeriod;
            })
            .reduce(
              (total, activity) => total + Number(activity.points || 0),
              0,
            );

          return {
            id: student.id,
            name: student.firstName
              ? `${student.firstName} ${student.lastName || ""}`.trim()
              : student.name || "Unknown",
            points,
            class: String(student.class ?? "").trim(),
            color:
              classColorMap[String(student.class ?? "").trim()] || "#3D348B",
          };
        })
        // Highest points first
        .sort((a, b) => b.points - a.points)
    );
  }, [filteredStudents, activities, period, today, currentMonth]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Student Points Performance
          </h2>

          <p className="text-sm text-slate-500">
            Individual student points comparison
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">
              Filter by Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Classes</option>

              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">
              Filter by Period
            </label>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="day">Today</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Class Color Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {classes
          .filter((cls) => selectedClass === "All" || selectedClass === cls)
          .map((cls) => (
            <div key={cls} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: classColorMap[cls],
                }}
              />

              <span className="text-xs text-slate-600">Class {cls}</span>
            </div>
          ))}
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No students available.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div
            style={{
              minWidth: `${Math.max(chartData.length * 40, 500)}px`,
              height: "350px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 65,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 11 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [`${value} points`, "Points"]}
                  labelFormatter={(label) => `Student: ${label}`}
                />

                <Bar
                  dataKey="points"
                  radius={[5, 5, 0, 0]}
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;

                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={5}
                        fill={payload.color}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Student Count */}
      <p className="text-xs text-slate-400 mt-3">
        Showing {chartData.length} students
      </p>
    </div>
  );
}

export default ClassPointsChart;
