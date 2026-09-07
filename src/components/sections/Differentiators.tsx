import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { differentiators } from "@/lib/data/differentiators";

export function Differentiators() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow="Pourquoi moi" title="Ce qui fait la différence" />

        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.label} className="border-t border-border pt-4">
              <p className="font-heading text-lg font-semibold text-neutral-700">{item.label}</p>
              <p className="mt-1 text-neutral-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
