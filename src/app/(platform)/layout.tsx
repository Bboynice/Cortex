// src/app/app/layout.tsx
import Header from "@/src/components/platform/navigation/Header/Header"; 

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
       {/* 🟢 The Header is ONLY here */}
      <Header />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}