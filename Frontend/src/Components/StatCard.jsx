
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div className="rounded-lg bg-emerald-50 p-3 text-[#176B55]">
          <Icon size={20} />
        </div>

      </div>

      <h2 className="mt-3 text-3xl font-bold text-[#173B32]">
        {value}
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}
