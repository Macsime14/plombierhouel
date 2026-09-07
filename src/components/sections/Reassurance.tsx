import { Container } from "@/components/ui/Container";
import { reassurance } from "@/lib/data/reassurance";

export function Reassurance() {
  return (
    <div className="border-y border-border">
      <Container>
        <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4 sm:py-10">
          {reassurance.map((item) => (
            <div key={item.label} className="text-center sm:border-l sm:border-border sm:first:border-l-0">
              <dt className="font-heading text-xl font-semibold text-neutral-700 sm:text-2xl">{item.value}</dt>
              <dd className="mt-1 text-sm text-neutral-500">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
