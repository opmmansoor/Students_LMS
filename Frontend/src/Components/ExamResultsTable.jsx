import { Pencil, Trash2 } from "lucide-react";
export default function ExamResultsTable({ results = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-[#F1F5F3] text-xs uppercase text-[#365B50]">
          <tr>
            {[
              "Student",
              "Class",
              "Subject",
              "Exam",
              "Date",
              "Marks",
              "Total",
              "Percentage",
              "Status",
              "Actions",
            ].map((x) => (
              <th className="p-4" key={x}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {results.map((exam) => {
            const passed = exam.percentage >= 40;
            return (
              <tr key={exam.id}>
                <td className="p-4 font-semibold">{exam.studentName}</td>
                <td className="p-4">{exam.className}</td>
                <td className="p-4">{exam.subject}</td>
                <td className="p-4">{exam.exam}</td>
                <td className="p-4">{String(exam.date).slice(0, 10)}</td>
                <td className="p-4">{exam.marks}</td>
                <td className="p-4">{exam.total}</td>
                <td className="p-4">{exam.percentage.toFixed(1)}%</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {passed ? "Pass" : "Fail"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(exam)}
                      className="rounded-lg p-2 text-blue-700"
                      aria-label="Edit exam"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(exam.id)}
                      className="rounded-lg p-2 text-red-600"
                      aria-label="Delete exam"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {!results.length && (
            <tr>
              <td colSpan="10" className="p-8 text-center">
                No examination results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
