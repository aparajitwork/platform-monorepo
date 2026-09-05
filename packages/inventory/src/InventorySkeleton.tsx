
const InventorySkeleton = () => {
  return (
    <div className="mt-3 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-10 animate-pulse rounded-md bg-line" />
      ))}
    </div>
  );
}

export default InventorySkeleton