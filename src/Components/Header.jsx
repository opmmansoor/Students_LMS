
import { Bell, CalendarDays } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="flex h-[70px] items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

      <h2 className="font-semibold text-slate-800">
        {title}
      </h2>

      <div className="flex items-center gap-4">

        <span className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <CalendarDays size={16} />
          {new Date().toLocaleDateString("en-IN")}
        </span>

        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          AD
        </div>

      </div>
    </header>
  );
}
