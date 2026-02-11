// src/app/app/layout.tsx

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-0 w-full flex flex-col">
      <main className="flex-1 min-h-0 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}