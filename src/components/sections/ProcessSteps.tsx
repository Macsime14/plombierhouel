import { Container } from "@/components/ui/Container";
import { process } from "@/lib/data/process";

export function ProcessSteps() {
  return (
    <section className="bg-accent py-16 sm:py-24">
      <Container>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-700 sm:text-4xl">
          {process.title}
        </h2>

        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {process.steps.map((step) => (
            <div key={step.title}>
              <p className="font-heading text-lg font-semibold text-neutral-700">{step.title}</p>
              <p className="mt-1 text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
