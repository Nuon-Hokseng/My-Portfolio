import { SpiderWeb } from "@/components/comic/SpiderWeb";
import { Kaboom } from "@/components/comic/Kaboom";

const socials = [
  { label: "Email", href: "mailto:sengnoname168@gmail.com" },
  { label: "GitHub", href: "https://github.com/Nuon-Hokseng" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nuon-hokseng-b5b65b33b/" },
  { label: "Facebook", href: "https://web.facebook.com/Seng.kisuke/" },
  { label: "Telegram", href: "https://t.me/sengkennedy" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-ink px-5 py-16 md:px-10 lg:py-28">
      <SpiderWeb className="bottom-0 right-0 -scale-100" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[3fr_9fr] lg:gap-10">
        <h2 className="comic-caption self-start">Contact</h2>

        <div>
          <p className="display-tight print-offset max-w-[9em] text-[clamp(3.5rem,8vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.015em] text-ink">
            Let&apos;s stay connected
          </p>

          {/* BOOM! pops beside the buttons when "Contact me" is hovered or focused */}
          <div className="contact-cta relative mt-9 flex flex-wrap gap-4">
            <Kaboom rotate={8} className="left-[262px] top-[-14px] md:left-[316px] md:top-[-22px]" />
            <a href="https://t.me/sengkennedy" className="comic-btn comic-btn-red">
              Contact me
            </a>
            <a href="/Nuon_HokSeng_CV.pdf" download="Nuon_HokSeng_CV.pdf" className="comic-btn">
              Download CV
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="font-semibold underline decoration-krama decoration-2 underline-offset-[6px] hover:text-krama"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
