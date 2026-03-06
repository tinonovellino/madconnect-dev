import type { ReactNode } from "react";
import { HeroSection } from "./HeroSection";

interface LayoutProps {
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}

export function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <div className="content supporting hero connectors-page">
      <HeroSection title={title} subtitle={subtitle} />
      {children}
    </div>
  );
}

export default Layout;
