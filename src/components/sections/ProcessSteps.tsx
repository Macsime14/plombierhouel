import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { process } from "@/lib/data/process";

export function ProcessSteps() {
  return (
    <section className="bg-accent py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Notre méthode"
          title="Les 4 étapes d'une intervention réussie"
          description={process.intro}
          center
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative border-t-2 border-primary/15 pt-8">
                <span className="absolute -top-[2px] left-0 h-0.5 w-10 bg-warm" aria-hidden="true" />
                <span className="font-heading text-6xl leading-none font-bold text-primary/10 select-none" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <Icon size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-neutral-700">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-neutral-500">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
