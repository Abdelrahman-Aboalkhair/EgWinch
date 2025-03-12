export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="px-6 py-2 rounded-lg shadow-md">{children}</div>
    </main>
  );
}
