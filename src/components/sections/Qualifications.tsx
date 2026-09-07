import { Container } from "@/components/ui/Container";
import { qualifications } from "@/lib/data/qualifications";

export function Qualifications() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-700 sm:text-4xl">
          {qualifications.title}
        </h2>

        <div>
          <ul className="space-y-3 text-neutral-700">
            {qualifications.items.map((item) => (
              <li key={item} className="border-b border-border pb-3 font-medium">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-neutral-500">{qualifications.note}</p>
        </div>
      </Container>
    </section>
  );
}
