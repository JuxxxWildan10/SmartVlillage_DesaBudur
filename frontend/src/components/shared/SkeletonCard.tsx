/**
 * SkeletonCard — Reusable skeleton loading components
 * Used across pages while data is being fetched from API
 */

/** Skeleton for news/event cards */
export function SkeletonBeritaCard() {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-5 w-24" />
      </div>
      <div className="skeleton h-6 w-full mb-2" />
      <div className="skeleton h-6 w-4/5 mb-3" />
      <div className="skeleton h-4 w-32" />
    </div>
  );
}

/** Skeleton for article cards (with image) */
export function SkeletonArtikelCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="p-5">
        <div className="skeleton h-5 w-24 mb-3" />
        <div className="skeleton h-5 w-full mb-2" />
        <div className="skeleton h-5 w-3/4 mb-3" />
        <div className="skeleton h-4 w-28" />
      </div>
    </div>
  );
}

/** Skeleton for stat counter cards */
export function SkeletonStatCard() {
  return (
    <div className="text-center">
      <div className="skeleton h-12 w-24 mx-auto mb-2 bg-white/10" style={{ background: 'rgba(255,255,255,0.1)', backgroundSize: '200% 100%' }} />
      <div className="skeleton h-4 w-20 mx-auto" style={{ background: 'rgba(255,255,255,0.1)', backgroundSize: '200% 100%' }} />
    </div>
  );
}

/** Skeleton for service cards */
export function SkeletonServiceCard() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="skeleton h-16 w-16 rounded-xl mb-6" />
      <div className="skeleton h-6 w-3/4 mb-3" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  );
}

/** Generic skeleton line */
export function SkeletonLine({ width = "w-full", height = "h-4" }: { width?: string; height?: string }) {
  return <div className={`skeleton ${width} ${height}`} />;
}
