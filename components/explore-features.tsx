import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { H1, P, Span } from "./ui/text";
import { Row } from "./ui/row";
import { BackgroundBeams } from "./background-beams";

export const ExploreFeature = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200">
          Explore Pro Features
        </Button>
      </DialogTrigger>
      <DialogContent className=" !border !border-gray-900 bg-black flex flex-col items-center fixed left-[50%] top-[50%] w-[100vw] max-h-[85vh] min-h-[30vh] sm:w-[100vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 p-[25px] focus:outline-none">
        <Row className=" items-center">
          <div className="sm:px-12 sm:py-8  max-w-2xl mx-auto bg-black relative flex flex-col items-center justify-center antialiased">
            <H1 className="relative z-10 md:leading-relaxed text-gradient text-center font-bold">
              Coming with Pro<Span className=" text-slate-200">✨</Span>
            </H1>
            <P className="text-white text-lg">Multiple Upload</P>
            <P className="text-white text-lg">Translation any language</P>
            <P className="text-white text-lg">Longer inputs</P>
            <P className="text-white text-lg">Prompting</P>
            <P className="text-white text-lg">Post-processing with GPT-4</P>
          </div>
        </Row>
        <BackgroundBeams />
      </DialogContent>
    </Dialog>
  );
};
