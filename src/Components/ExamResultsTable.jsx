import { Pencil } from "lucide-react";

export default function ExamResultsTable({ results = [], onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-[#F1F5F3] text-xs uppercase tracking-wide text-[#365B50]">
          <tr>
            <th className="p-4">Student</th>
            <th className="p-4">Class</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Exam</th>
            <th className="p-4">Date</th>
            <th className="p-4">Marks</th>
            <th className="p-4">Total</th>
            <th className="p-4">Percentage</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((exam) => {
            const passed = exam.percentage >= 35;
            return (
              <tr key={exam.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{exam.studentName}</td>
                <td className="p-4 text-slate-600">{exam.className}</td>
                <td className="p-4 text-slate-600">{exam.subject}</td>
                <td className="p-4 text-slate-600">{exam.exam || exam.examName || "—"}</td>
                <td className="p-4 text-slate-600">{exam.date}</td>
                <td className="p-4 font-semibold text-[#176B55]">{exam.marks}</td>
                <td className="p-4 text-slate-600">{exam.total}</td>
                <td className="p-4 font-semibold text-slate-700">{exam.percentage.toFixed(1)}%</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {passed ? "Pass" : "Fail"}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => onEdit(exam)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50" title="Edit result">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
          {results.length === 0 && (
            <tr><td colSpan="10" className="p-8 text-center text-slate-500">No examination results found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
