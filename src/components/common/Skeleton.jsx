import clsx from "clsx";

export default function Skeleton({ className, rounded = "rounded-xl" }) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-white/[0.04] border border-white/[0.02]",
        rounded,
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>
  );
}
