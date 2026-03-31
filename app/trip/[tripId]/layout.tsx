export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex-1">{children}</div>
    </div>
  );
}
