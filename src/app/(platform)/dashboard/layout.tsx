// src/app/app/layout.tsx

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}