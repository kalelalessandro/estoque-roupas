export function SkeletonRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((__, c) => (
            <td className="td" key={c}>
              <div className="skeleton h-4 w-full max-w-[10rem]" style={{ animationDelay: `${(r + c) * 60}ms` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
