import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { reassurance } from "@/lib/data/reassurance";

export function Reassurance() {
  return (
    <div className="border-y border-border">
      <Container>
        <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4 sm:py-10">
          {reassurance.map((item, index) => (
            <Reveal key={item.label} delay={index * 90} className="sm:border-l sm:border-border sm:first:border-l-0">
              <div className="text-center">
                <dt className="font-heading text-xl font-semibold text-neutral-700 sm:text-2xl">{item.value}</dt>
                <dd className="mt-1 text-sm text-neutral-500">{item.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </div>
  );
}
