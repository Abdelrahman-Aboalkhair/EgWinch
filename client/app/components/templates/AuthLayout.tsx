export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className=" border-gray-200 border px-6 py-2 rounded-lg shadow-sm">
        {children}
      </div>
    </main>
  );
}
