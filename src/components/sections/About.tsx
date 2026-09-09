import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SiteData } from "@/lib/domain/site-data";

export function About({
  about,
  photo,
}: {
  about: SiteData["about"];
  photo: SiteData["aboutPhoto"];
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionTitle title="Une entreprise de terrain" />
          <p className="mt-6 text-lg font-medium text-text">{about.intro}</p>
          {about.paragraphes.map((paragraphe, index) => (
            <p key={index} className="mt-4 text-text-muted">
              {paragraphe}
            </p>
          ))}

          {about.tags.length > 0 ? (
            <p className="mt-8 border-t border-border pt-6 text-sm text-text-muted">
              {about.tags.join(" · ")}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
