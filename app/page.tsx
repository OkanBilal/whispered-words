"use client";

import Upload from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/icons";
import { H1, P, H2, Span } from "@/components/ui/text";
import { Column } from "@/components/ui/column";
import { Row } from "@/components/ui/row";
import { FeatureList } from "@/components/feature-list";
import Link from "next/link";
import { ExploreFeature } from "@/components/explore-features";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { transcription } from "@/data/transcription";
import TranscriptionVisualizer from "@/components/transcription-visualizer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl">
        <Column className=" sm:pt-28 sm:px-28 p-8 ">
          <div className="relative flex self-center place-items-center before:absolute before:h-[300px] before:w-[280px]  sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[40px] after:translate-x-1/3 after:bg-gradient-conic  after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-50 after:from-sky-900 after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] z-[-1]" />
          <H1 className="text-gradient text-center mb-4">
            Convert sound recordings into written text
          </H1>
          <P className="text-white text-center mb-12">
            Record your thoughts, and watch them transform into structured text,
            ready for immediate use.
          </P>
          <Row className="items-center justify-center mb-12">
            <Link href={"https://github.com/OkanBilal/whispered-words"}>
              <Button
                leftIcon={<Github color="#fff" />}
                className=" bg-black hover:bg-neutral-900 text-white rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-neutral-800 text-sm font-semibold mr-4 transition-all duration-200"
              >
                See on GitHub
              </Button>
            </Link>
            <ExploreFeature />
          </Row>

          <div className="mt-16 mb-8">
            <H2 className="text-gradient text-center mb-6">
              Experience superhuman accuracy
            </H2>
          </div>
          <div className="lg:flex items-center mb-12">
            <div className="lg:mr-24 mr-0 lg:mb-0 mb-24">
              <FeatureList
                icon="〄"
                title="Support for 50+ Languages"
                description="Offering transcription capabilities in a wide range of global
                  languages and dialects."
              />
              <FeatureList
                icon="⎋"
                title="Just upload audio in any file type"
                description="Effortlessly turn your audio files into text transcriptions."
              />
              <FeatureList
                icon="☇"
                title="Export most popular transcription formats"
                description="Select the best format for your purpose and easily share your transcripts!"
              />
            </div>
            <Upload />
          </div>
          {/* <Row className=" items-center">
        <div className="px-12 py-8 max-w-2xl mx-auto bg-black relative flex flex-col items-center justify-center antialiased">
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
      </Row> */}
          <div className="mb-24">
            <H2 className="text-gradient text-center mb-2">See it in action</H2>
            <TranscriptionVisualizer
              audioSrc="gwh.mp4"
              transcription={transcription}
            />
          </div>
        </Column>
      </div>
      <Footer />
    </>
  );
}
