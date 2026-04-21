export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cortex-abyss px-4 py-10 text-white">
      {children}
    </main>
  );
}
