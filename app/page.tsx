import PhoenixInfo from "./components/PhoenixInfo";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6">
          <PhoenixInfo />
        </div>
      </main>
    </div>
  );
}
