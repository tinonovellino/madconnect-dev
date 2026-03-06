import type { ReactNode } from "react";
import heroBg from "../assets/images/hero-bg.jpg";

interface HeroSectionProps {
  title: ReactNode;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="hero-container">
      <div className="hero-content-container">
        <div className="gradient-1" />
        <img src={heroBg} alt="" aria-hidden="true" />
      </div>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  );
}

export default HeroSection;
