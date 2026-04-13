export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_80%_50%,rgba(249,115,22,0.12),transparent_50%),linear-gradient(180deg,#050816_0%,#060d1d_42%,#091326_100%)] px-4 py-10 text-white">
      {children}
    </main>
  );
}
