
import {
  Users,
  ClipboardCheck,
  Award,
  BookOpen,
} from "lucide-react";

import StatCard from "./StatCard";
import ClassPointsChart from "./ClassPointsChart";

export default function Overview({
  data,
  getPoints,
  getExamAverage,
  today,
  currentMonth,
  setPage,
}) {
  const average = getExamAverage();

  // Monthly point leaders
  const leaders = [...data.students]
    .map((student) => ({
      ...student,
      points: getPoints(student.id, currentMonth),
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // Recent activities
  const recentActivities = [...data.activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Dashboard statistics
  const stats = [
    {
      title: "Total Students",
      value: data.students.length,
      description: "Registered students",
      icon: Users,
    },
    {
      title: "Today's Activities",
      value: data.activities.filter(
        (a) => a.date === today
      ).length,
      description: "Activities recorded today",
      icon: ClipboardCheck,
    },
    {
      title: "Monthly Points",
      value: getPoints("", currentMonth),
      description: "Points earned this month",
      icon: Award,
    },
    {
      title: "Exam Average",
      value:
        average === null
          ? "—"
          : `${average.toFixed(1)}%`,
      description: "Average examination score",
      icon: BookOpen,
    },
  ];

  return (
    <div>

      {/* Heading */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#14213d]">
            Student Performance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor student development and academic progress.
          </p>
        </div>

        <button
          onClick={() => setPage("students")}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          + Add Student
        </button>

      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}

      </div>

      {/* Class Graph + Recent Activities */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Class-wise Points Graph */}
        <ClassPointsChart
          students={data.students}
          activities={data.activities}
        />

        {/* Recent Activities */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">
              Recent Activities
            </h2>

            <button
              onClick={() => setPage("activities")}
              className="text-xs font-semibold text-blue-700"
            >
              View all
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No activities recorded yet.
            </p>
          ) : (
            <div className="space-y-4">

              {recentActivities.map((activity) => {
                const student = data.students.find(
                  (s) =>
                    String(s.id) === String(activity.studentId)
                );

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
                  >

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {student?.name || "Unknown student"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {activity.category} · {activity.date}
                      </p>
                    </div>

                    <span
                      className={`text-sm font-bold ${
                        Number(activity.points) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Number(activity.points) > 0 ? "+" : ""}
                      {activity.points} pts
                    </span>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* Monthly Point Leaders */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="mb-5 font-bold text-slate-800">
            Monthly Point Leaders
          </h2>

          {leaders.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Add students to view rankings.
            </p>
          ) : (
            leaders.map((student, index) => {

              const maximum = Math.max(
                1,
                ...leaders.map((s) => Math.max(0, s.points))
              );

              return (
                <div
                  key={student.id}
                  className="mb-5"
                >

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-medium text-slate-700">
                      {index + 1}. {student.name}
                    </span>

                    <span className="font-bold text-blue-700">
                      {student.points} pts
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${
                          Math.max(
                            0,
                            (student.points / maximum) * 100
                          )
                        }%`,
                      }}
                    />
                  </div>

                </div>
              );
            })
          )}

        </section>

      </div>

    </div>
  );
}
