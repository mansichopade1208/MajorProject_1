
export default function FeatureCard({
  title,
  description,
  Icon,
  tone = "green",
}) {
  const colors =
    tone === "peach"
      ? "bg-[#EED9C9] text-[#A45D36]"
      : "bg-[#D8E7DD] text-[#3D6C62]";

  return (
    <article className="min-w-0">
      <div
        className={`mb-3 flex h-[68px] w-[68px] items-center justify-center rounded-full ${colors}`}
      >
        <Icon size={39} strokeWidth={1.7} />
      </div>

      <h2 className="mb-2 text-lg font-bold text-[#47796F] sm:text-xl">
        {title}
      </h2>

      <p className="max-w-[260px] text-sm leading-[1.8] text-[#52746D] sm:text-[15px]">
        {description}
      </p>
    </article>
  );
}
