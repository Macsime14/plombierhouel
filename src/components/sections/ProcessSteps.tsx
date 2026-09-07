import { Container } from "@/components/ui/Container";
import { process } from "@/lib/data/process";

export function ProcessSteps() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-700 sm:text-4xl">
          {process.title}
        </h2>

        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {process.steps.map((step, index) => (
            <div key={step.title}>
              <span className="font-heading text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-1 font-heading text-lg font-semibold text-neutral-700">{step.title}</p>
              <p className="mt-1 text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
