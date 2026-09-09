import { Container } from "@/components/ui/Container";
import { reassurance } from "@/lib/data/reassurance";

export function Reassurance() {
  return (
    <div className="border-y border-border bg-surface">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-3.5 text-sm text-text-muted">
          {reassurance.map((item, index) => (
            <li key={item} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-border">
                  ·
                </span>
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
