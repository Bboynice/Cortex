// src/app/app/layout.tsx
import Header from "@/src/components/platform/navigation/Header/Header"; 
import SavePopUp from "@/src/components/ui/savePopup";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <SavePopUp title="Do you want to submit this code?" description="This code will be submitted to the server and will be saved." submitText="Submit" cancelText="Cancel" />
      <main className="flex-1 min-h-0 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}