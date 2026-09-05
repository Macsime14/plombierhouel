import { MapPin } from "lucide-react";
import { zones } from "@/lib/data/zones";

export function InterventionZone() {
  return (
    <div className="flex flex-wrap gap-3">
      {zones.map((zone) => (
        <span
          key={zone.name}
          className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary"
        >
          <MapPin size={14} />
          {zone.name}
        </span>
      ))}
    </div>
  );
}
