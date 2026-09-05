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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {qualifications.map((qualification) => {
            const Icon = qualification.icon;
            return (
              <div key={qualification.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-neutral-700">
                  {qualification.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">{qualification.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
