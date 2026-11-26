
import { useState } from "react";
import { Download } from "lucide-react";

export default function Reports({
  data,
  getPoints,
  getExamAverage,
  today,
  currentMonth,
}) {
  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [studentFilter, setStudentFilter] =
    useState("");

  const months = [
    ...new Set([
      currentMonth,
      ...data.activities.map((a) => a.date.slice(0, 7)),
    ]),
  ].sort().reverse();

  const filteredStudents = data.students.filter(
    (student) =>
      !studentFilter || student.id === studentFilter
  );

  const exportCSV = () => {
    const rows = [
      [
        "Student",
        "Class",
        "Daily Points",
        "Monthly Points",
        "Lifetime Points",
        "Exam Average",
        "Discipline",
        "Attitude",
      ],

      ...filteredStudents.map((student) => [
        student.name,
        student.className,
        getPoints(student.id, today),
        getPoints(student.id, selectedMonth),
        getPoints(student.id),
        getExamAverage(student.id)?.toFixed(1) ?? "",
        student.discipline,
        student.attitude,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-performance-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#14213d]">
            Performance Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review student academic and daily activity performance.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={17} />
          Export CSV
        </button>

      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex flex-wrap gap-3">

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All Students</option>

            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Daily Points</th>
                <th className="p-3">Monthly Points</th>
                <th className="p-3">Exam Average</th>
                <th className="p-3">Discipline</th>
                <th className="p-3">Attitude</th>
                <th className="p-3">Lifetime Points</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student) => {

                const examAverage =
                  getExamAverage(student.id);

                return (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="p-3 font-semibold">
                      {student.name}
                      <p className="text-xs font-normal text-slate-400">
                        {student.className}
                      </p>
                    </td>

                    <td className="p-3">
                      {getPoints(student.id, today)}
                    </td>

                    <td className="p-3 font-bold text-blue-700">
                      {getPoints(student.id, selectedMonth)}
                    </td>

                    <td className="p-3">
                      {examAverage === null
                        ? "—"
                        : `${examAverage.toFixed(1)}%`}
                    </td>

                    <td className="p-3">
                      {student.discipline}/5
                    </td>

                    <td className="p-3">
                      {student.attitude}/5
                    </td>

                    <td className="p-3 font-bold text-green-700">
                      {getPoints(student.id)}
                    </td>

                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-400"
                  >
                    No student records found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      <div className="mt-5 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <strong>Scoring note:</strong> Daily and monthly points are
        calculated from activity records. Examination marks are
        calculated separately and are not added to activity points.
      </div>

    </div>
  );
}
