import Image from "next/image";
import Upload from "./components/upload-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-40 ">
      <div className="relative pt-24 flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic  after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-50 after:from-sky-900 after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      <p className=" text-white text-4xl mb-8 font-semibold">Whispered Words</p>
      <Upload />
    </main>
  );
}
