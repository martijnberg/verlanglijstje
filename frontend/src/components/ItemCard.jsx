// frontend/src/components/ItemCard.jsx
export default function ItemCard({
  title,
  description,
  url,
  linkLabel = "Bekijk link",
  children,
}) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm
                 hover:shadow-lg hover:-translate-y-0.5 transition-all
                 backdrop-blur-sm"
    >
      <h2 className="text-lg font-semibold text-white tracking-wide">
        {title}
      </h2>

      {description && (
        <p className="text-slate-300 text-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 underline
                     text-xs mt-2"
        >
          {linkLabel}
        </a>
      )}

      {children && (
        <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}
