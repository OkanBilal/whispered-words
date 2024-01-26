import { BackgroundBeams } from "@/components/background-beams";
import { Row } from "@/components/ui/row";
import { H1, P, Span } from "@/components/ui/text";

export default function ProPage() {
  return (
    <div className="space-y-6">
      <Row className=" items-center">
        <div className="px-16 py-8 max-w-3xl mx-auto bg-black relative flex flex-col items-center justify-center antialiased">
          <H1 className="relative z-10 md:leading-relaxed text-gradient text-center font-bold">
            Coming Soon with Pro<Span className=" text-slate-200">✨</Span>
          </H1>
          <P className="text-white text-lg">Multiple Upload</P>
          <P className="text-white text-lg">Translation any language</P>
          <P className="text-white text-lg">Longer inputs</P>
          <P className="text-white text-lg">Prompting</P>
          <P className="text-white text-lg">Post-processing with GPT-4</P>
          <BackgroundBeams />
        </div>
      </Row>
    </div>
  );
}
