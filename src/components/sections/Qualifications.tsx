import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { qualifications } from "@/lib/data/qualifications";

export function Qualifications() {
  return (
    <section className="bg-accent py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Qualifications"
          title="Des compétences reconnues"
          description="Des formations et habilitations qui garantissent un travail conforme et de qualité."
          center
        />

        <div className="mt-12 divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/10 sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {qualifications.map((qualification) => {
            const Icon = qualification.icon;
            return (
              <div key={qualification.title} className="flex flex-col items-center gap-2 p-6 text-center">
                <Icon size={24} className="text-primary" />
                <h3 className="font-heading text-base font-semibold text-neutral-700">{qualification.title}</h3>
                <p className="text-sm text-neutral-500">{qualification.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
