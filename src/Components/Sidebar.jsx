
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  GraduationCap,
  ChartNoAxesColumn,
  School,
} from "lucide-react";

const menuItems = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "students", name: "Students", icon: Users },
  { id: "activities", name: "Daily Activities", icon: ClipboardList },
  { id: "exams", name: "Exam Marks", icon: GraduationCap },
  { id: "reports", name: "Reports", icon: ChartNoAxesColumn },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="w-full bg-[#14213d] p-4 text-white md:min-h-screen md:w-64">

      <div className="mb-7 flex items-center gap-3 px-2">
        <School size={28} className="text-blue-300" />

        <div>
          <h2 className="font-bold tracking-wide">
             <span> ISHA`ATHUSSUNNA </span> 
             <span> MADRASA LMS </span>
          </h2>
          <p className="text-[9px] text-slate-400">
            STUDENT PERFORMANCE PORTAL
          </p>
        </div>
      </div>

      <p className="mb-3 px-3 text-xs tracking-widest text-slate-400">
        WORKSPACE
      </p>

      <nav className="flex gap-2 overflow-x-auto md:flex-col">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                page === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}

      </nav>

      <div className="mt-8 hidden border-t border-slate-700 pt-5 text-xs text-slate-400 md:block">
        Academic Administration
        <br />
        Learning Management System
      </div>

    </aside>
  );
}
