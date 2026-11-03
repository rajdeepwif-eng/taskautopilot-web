const TITLES: Record<string, string> = {
  terms: "Terms of service",
  privacy: "Privacy policy",
  refunds: "Refund policy",
  dpa: "Data-processing agreement",
};

export function generateStaticParams() {
  return Object.keys(TITLES).map((doc) => ({ doc }));
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  return (
    <main className="wrap flex flex-col gap-4 py-16">
      <h1 className="font-display m-0 text-4xl font-bold">{TITLES[doc] ?? "Legal"}</h1>
      <p className="m-0 text-lg text-ink-2">[To be supplied by your solicitor before launch.]</p>
    </main>
  );
}
