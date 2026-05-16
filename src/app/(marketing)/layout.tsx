import MarketingShell from "@/src/components/marketing/MarketingShell";

export default function MarketingRouteLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}