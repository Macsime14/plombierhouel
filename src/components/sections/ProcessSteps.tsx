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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-neutral-700">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
