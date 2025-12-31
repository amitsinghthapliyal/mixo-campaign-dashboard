"use client";

export default function Error({ error }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>

      <p className="text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>

      <p className="text-sm text-muted-foreground">Try to refresh the page.</p>
    </div>
  );
}
