  "use client"

import React, { useRef, useState, useEffect, memo, useCallback } from "react";

interface Word {
  word: string; 
  start: number; 
  end: number;
}

interface TranscriptionVisualizerProps {
  audioSrc: string;
  transcription: {
    words: Word[];
  };
}

const TranscriptionWord = memo(({ 
  word, 
  isActive, 
  onClick 
}: { 
  word: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`cursor-pointer text-sm px-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      isActive ? "bg-[#0141ff] text-white" : "text-[#5c616f] hover:bg-gray-100"
    }`}
    aria-pressed={isActive}
  >
    {word}{" "}
  </button>
));

TranscriptionWord.displayName = "TranscriptionWord";

const TranscriptionVisualizer: React.FC<TranscriptionVisualizerProps> = ({ audioSrc, transcription }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const playFromTime = useCallback((time: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play().catch(error => 
        console.error("Error playing audio:", error)
      );
    }
  }, []);

  useEffect(() => {
    const activeIndex = transcription.words.findIndex(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    
    if (activeIndex !== activeWordIndex) {
      setActiveWordIndex(activeIndex);
    }
  }, [currentTime, transcription.words, activeWordIndex]);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    audioElement?.addEventListener("timeupdate", updateTime);

    return () => {
      audioElement?.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <audio ref={audioRef} controls className="w-full max-w-md">
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-4 max-w-2xl text-justify">
        {transcription.words.map((word, index) => (
          <TranscriptionWord
            key={`${word.word}-${index}`}
            word={word.word}
            isActive={index === activeWordIndex}
            onClick={() => playFromTime(word.start)}
          />
        ))}
      </div>
    </div>
  );
};

export default TranscriptionVisualizer;
