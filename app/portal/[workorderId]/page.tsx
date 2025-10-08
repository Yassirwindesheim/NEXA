interface Props { params: { workorderId: string } }
export default function PortalPage({ params }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Klantportaal</h2>
      <p>Publieke weergave voor werkorder: <strong>{params.workorderId}</strong></p>
      <p>Toon voortgangsbalk en takenlijst hier.</p>
    </section>
  );
}