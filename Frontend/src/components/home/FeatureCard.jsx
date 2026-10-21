
export default function FeatureCard({
  title,
  description,
  Icon,
  tone = "green",
}) {
  const colors =
    tone === "peach"
      ? "bg-[#F8E8DD] text-[#A45D36]"
      : "bg-[#E0EEE4] text-[#47796F]";

  return (
    <article className="group h-full rounded-2xl border border-[#E8EDE7] bg-[#FCFDFB] p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C9DDD0] hover:bg-white hover:shadow-xl hover:shadow-[#214A43]/10 sm:p-8">
      <div
        className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${colors}`}
      >
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <h3 className="mb-3 text-xl font-bold text-[#214A43]">
        {title}
      </h3>

      <p className="text-sm leading-7 text-[#627C74] sm:text-base">
        {description}
      </p>
    </article>
  );
}
