import PhoenixInfo from "../components/PhoenixInfo";

export default function NodePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-8">Node Information</h1>
        <div className="grid gap-6">
          <PhoenixInfo />
        </div>
      </main>
    </div>
  );
} 