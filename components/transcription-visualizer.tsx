import React, { useRef, useState, useEffect } from "react";

const TranscriptionVisualizer = ({ audioSrc, transcription }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(null);

  const playFromTime = (time) => {
    audioRef.current.currentTime = time;
    audioRef.current.play();
  };

  const displayTranscription = () => {
    return transcription.words.map((word, index) => (
      <span
        key={index}
        onClick={() => playFromTime(word.start)}
        style={{
          cursor: "pointer",
          color: index === activeWordIndex ? "white" : "#5c616f",
          backgroundColor:
            index === activeWordIndex ? "#0141ff" : "transparent",
          borderRadius: "8px",
          padding: "1px",
          fontSize: "15px",
        }}
      >
        {word.word}{" "}
      </span>
    ));
  };

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
      const activeIndex = transcription.words.findIndex(
        (word) => currentTime >= word.start && currentTime <= word.end
      );
      setActiveWordIndex(activeIndex);
    };

    audioRef.current.addEventListener("timeupdate", updateTime);

    return () => {
      audioRef.current.removeEventListener("timeupdate", updateTime);
    };
  }, [transcription.words, currentTime]);

  return (
    <div className="flex flex-col items-center">
      <audio ref={audioRef} controls>
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-4">{displayTranscription()}</div>
    </div>
  );
};

export default TranscriptionVisualizer;
