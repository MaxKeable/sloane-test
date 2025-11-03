import { useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
        isFinal: boolean;
      };
    };
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent {
    error: string;
  }

  type SpeechRecognition = EventTarget & {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    onstart: () => void;
  };
}

type Props = {
  onTranscriptChange: (text: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  setIsListening: (value: boolean) => void;
  recognitionRef: any;
};

const VoiceToText = ({ onTranscriptChange, isListening, onToggleListening, setIsListening, recognitionRef }: Props) => {
  const [error, setError] = useState("");
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);

  useEffect(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < (event.results as any).length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }
      if (finalTranscript && isListening) {
        onTranscriptChange(finalTranscript);
      }
    };
  }, [isListening, onTranscriptChange, recognitionRef]);


  const startListening = useCallback(
    (isListening: boolean) => {
      if (!recognitionRef.current && isListening) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setError("");
          setIsRecognitionActive(true);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Recognition error:", event.error);
          setError(`Error: ${event.error}. Please try again.`);
          setIsRecognitionActive(false); // Ensure state is reset
          onToggleListening();
        };

        recognition.onend = () => {
          setIsRecognitionActive(false);
          // Only restart if we're still supposed to be listening
          if (isListening) {
            try {
              recognitionRef.current?.start();
            } catch (err) {
              console.error("Restart error:", err);
            }
          }
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < (event.results as any).length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            }
          }
          if (finalTranscript && isListening) {
            onTranscriptChange(finalTranscript);
          }
        };
      }

      // Ensure recognition only starts if it's not already running
      if (recognitionRef.current && !isRecognitionActive) {
        try {
          recognitionRef.current.start();
          setIsRecognitionActive(true); // Set state after successfully starting
        } catch (err) {
          console.error("Start error:", err);
        }
      }
    },
    [recognitionRef, isRecognitionActive, onToggleListening, onTranscriptChange]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      const recognition: any = recognitionRef.current;
      recognition.onend = () => {
        setError("");
        setIsRecognitionActive(false);
      };
      recognitionRef.current.stop();
      setIsRecognitionActive(false);
      setIsListening(false);
    }
  }, [recognitionRef, setIsListening, setIsRecognitionActive, setError]);

  useEffect(() => {
    if (isListening) {
      startListening(isListening);
    } else {
      stopListening();
    }
  }, [isListening, recognitionRef, stopListening, startListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [recognitionRef]);

  if (error) {
    return (
      <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return null;
};

export default VoiceToText;
