import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/lib/data/differentiators";

export function Differentiators() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle title="Ce qui fait la différence" />

        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {differentiators.map((item, index) => (
            <Reveal key={item.label} delay={index * 90}>
              <div className="border-t border-border pt-4">
                <p className="mt-1 font-heading text-lg font-semibold text-text">{item.label}</p>
                <p className="mt-1 text-text-muted">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
