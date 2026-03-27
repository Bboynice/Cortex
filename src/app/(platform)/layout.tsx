// src/app/app/layout.tsx
import Header from "@/src/components/platform/navigation/Header/Header"; 
import SavePopUp from "@/src/components/ui/savePopup";
import ToastContainer from "@/src/components/ui/ToastContainer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <SavePopUp />
      <ToastContainer />
      <main className="flex-1 min-h-0 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}