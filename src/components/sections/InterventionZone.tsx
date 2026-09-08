import { zones } from "@/lib/data/zones";

export function InterventionZone() {
  return (
    <p className="text-lg text-text">
      {zones.map((zone, index) => (
        <span key={zone.name}>
          {zone.name}
          {index < zones.length - 1 && <span className="mx-2 text-accent">·</span>}
        </span>
      ))}
    </p>
  );
}
