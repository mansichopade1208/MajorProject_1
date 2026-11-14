
export default function StatCard({
  icon: Icon,
  value,
  label,
  background,
  iconColor,
}) {
  return (
    <div className="bg-white border border-[#E8E5DE]
      rounded-2xl p-5 hover:shadow-md transition">

      <div className={`w-14 h-14 ${background}
        rounded-full flex items-center justify-center mb-4`}>
        <Icon size={27} style={{ color: iconColor }} />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold
        text-[#214A43]">
        {value}
      </h2>

      <p className="text-sm font-medium text-[#66736F] mt-1">
        {label}
      </p>
    </div>
  );
}
