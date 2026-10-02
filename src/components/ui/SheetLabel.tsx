/** Drawing-set label: "01 — Build / Construction & property works". */
export function SheetLabel({
  number,
  name,
  detail,
  className = "",
}: {
  number?: string;
  name: string;
  detail?: string;
  className?: string;
}) {
  return (
    <p className={`mono flex flex-wrap content-start items-center gap-x-3 gap-y-1 self-start ${className}`}>
      {number && <span className="text-(--accent-text)">{number}</span>}
      <span>{name}</span>
      {detail && (
        <>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          <span className="opacity-70">{detail}</span>
        </>
      )}
    </p>
  );
}
