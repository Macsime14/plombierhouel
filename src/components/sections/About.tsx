import Image from "next/image";
import { ShieldCheck, HardHat, Mountain } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { about } from "@/lib/data/about";
import { aboutPhoto } from "@/lib/data/photos";

const icons = [HardHat, ShieldCheck, Mountain];

export function About() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <Image src={aboutPhoto.src} alt={aboutPhoto.alt} fill className="object-cover" />
        </div>

        <div>
          <SectionTitle eyebrow="À propos" title="Qui suis-je ?" />
          <p className="mt-6 text-lg font-medium text-neutral-700">{about.intro}</p>
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 text-neutral-500">
              {paragraph}
            </p>
          ))}

          <ul className="mt-8 space-y-4">
            {about.highlights.map((highlight, index) => {
              const Icon = icons[index] ?? ShieldCheck;
              return (
                <li key={highlight.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-neutral-700">{highlight.label}</p>
                    <p className="text-sm text-neutral-500">{highlight.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
