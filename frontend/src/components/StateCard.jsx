
export default function StateCard({ title, children, action }) {
  return (
    <div className="col-span-full rounded-2xl border-4 border-dashed border-ink bg-pow p-10 text-center">
      <h3 className="font-display text-4xl tracking-wide">{title}</h3>
      <p className="mx-auto mt-2 max-w-md font-medium">{children}</p>
      {action}
    </div>
  );
}
