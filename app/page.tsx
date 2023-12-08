import Image from "next/image";
import Upload from "./components/upload-form";

export default function Home() {
  return (
    <div className="flex  flex-col items-center p-32 ">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic  after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-50 after:from-sky-900 after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] z-[-1]"/>
      <p className="text-white text-4xl font-semibold mb-16" >Turn audio🔈 into text📃</p>
      <Upload />
    </div>
  );
}
