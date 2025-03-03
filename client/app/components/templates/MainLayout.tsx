import Navbar from "../organisms/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen px-[9rem]">
      <Navbar />
      {children}
    </div>
  );
}
