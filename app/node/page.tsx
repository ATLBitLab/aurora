import PhoenixInfo from "../components/PhoenixInfo";

export default function NodePage() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1136px] mx-auto">
        <h1 className="text-[32px] font-medium leading-[18px] text-white mb-8 sm:mb-10">Node Information</h1>
        <div className="grid gap-6 sm:gap-8">
          <PhoenixInfo />
        </div>
      </div>
    </main>
  );
} 