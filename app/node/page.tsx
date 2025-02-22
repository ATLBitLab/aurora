import PhoenixInfo from "../components/PhoenixInfo";

export default function NodePage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8">Node Information</h1>
      <div className="grid gap-6">
        <PhoenixInfo />
      </div>
    </main>
  );
} 