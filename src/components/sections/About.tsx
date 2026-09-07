import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { about } from "@/lib/data/about";
import { aboutPhoto } from "@/lib/data/photos";

export function About() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={aboutPhoto.src}
            alt={aboutPhoto.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionTitle eyebrow="L'entreprise" title="Une entreprise de terrain" />
          <p className="mt-6 text-lg font-medium text-neutral-700">{about.intro}</p>
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 text-neutral-500">
              {paragraph}
            </p>
          ))}

          <p className="mt-8 border-t border-border pt-6 text-sm text-neutral-500">{about.tags.join(" · ")}</p>
        </div>
      </Container>
    </section>
  );
}
