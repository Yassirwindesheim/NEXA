interface Props { params: { id: string } }
export default function WorkorderDetail({ params }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Werkorder #{params.id}</h2>
      <p>Details en taakoverzicht komen hier.</p>
    </section>
  );
}