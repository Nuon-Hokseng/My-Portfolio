import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
} from "lucide-react";
import { PortraitSpotlight } from "@/components/PortraitSpotlight";
import { cvUrl, socials } from "@/lib/site";

export default function HeroSection() {
  return (
    <section id="hero" className="poster-hero" aria-labelledby="poster-name">
      <div className="poster-stage">
        <h1 id="poster-name" className="poster-name" aria-label="Nuon Hokseng">
          <span className="name-outline">Nuon</span>{" "}
          <span className="name-solid">Hokseng</span>
        </h1>
        <PortraitSpotlight />
        <div className="poster-info">
          <h2>
            Full-stack
            <br className="desktop-role-break" /> web developer.
          </h2>
          <p>
            <strong>2.5 years</strong> building useful web products, from
            interface to deployment.
          </p>
          <div className="poster-actions">
            <a className="poster-button" href={cvUrl} download>
              Download CV <Download size={15} aria-hidden="true" />
            </a>
            <a className="poster-work" href="#gallery">
              View work <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="poster-links">
          <p className="poster-location">
            Based in
            <br />
            <strong>Cambodia</strong>
          </p>
          {socials
            .filter((s) => ["GitHub", "LinkedIn"].includes(s.label))
            .map((s) => (
              <a key={s.label} href={s.href} rel="me">
                {s.label === "GitHub" ? (
                  <Github size={17} aria-hidden="true" />
                ) : (
                  <Linkedin size={16} aria-hidden="true" />
                )}
                {s.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
        </div>
      </div>
      <div className="poster-footer">
        <p>
          Frontend <span>/</span> Backend <span>/</span> Deployment
        </p>
        <a href="#about">
          Scroll to explore <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
