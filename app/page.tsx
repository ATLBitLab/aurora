import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Aurora</h1>
          <p className="text-gray-400 text-lg">
            Your lightning prism management interface. Navigate through the menu to access different features.
          </p>
        </div>
      </main>
    </div>
  );
}
