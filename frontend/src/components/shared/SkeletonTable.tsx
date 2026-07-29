export default function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse flex flex-col w-full space-y-4 py-4">
      {[...Array(rows)].map((_, idx) => (
        <div key={idx} className="flex gap-4 px-6 items-center">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}
