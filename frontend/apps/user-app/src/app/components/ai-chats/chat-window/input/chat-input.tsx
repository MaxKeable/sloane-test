import { Textarea } from "@repo/ui-kit/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useTheme } from "../../../../../context/theme-context";
import VoiceToText from "../../../../pages/Onboarding/VoiceToText";
import { ChatFileInput } from "../preview/image-file-preview";
import { FilePreview } from "./file-preview";
import { VoiceButton } from "./voice-button";
import { SearchToggleButton } from "./search-toggle-button";
import { ModelSelectorButton } from "./model-selector-button";
import { ModelSelectorPopup } from "./model-selector-popup";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui-kit/components/ui/popover";
import { Button } from "@repo/ui-kit/components/ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useChatAssistantList } from "@/api/use-chat-api";

interface ChatInputProps {
  room: string;
  assistantId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ room, assistantId }) => {
  const { sendChat, selectedModel, setSelectedModel } = useChat();
  const { theme } = useTheme();
  const { data: assistants } = useChatAssistantList();
  const textFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);

  // Check if current assistant allows model selection
  const currentAssistant =
    assistants?.freeStyle?.id === assistantId
      ? assistants.freeStyle
      : assistants?.assistants?.find((a) => a.id === assistantId);
  const allowModelSelection = currentAssistant?.allowModelSelection ?? false;

  const handleToggleListening = () => {
    setIsListening(!isListening);
  };

  type FormValues = { question: string };
  const { register, handleSubmit, setValue, getValues, reset, watch } =
    useForm<FormValues>({
      defaultValues: { question: "" },
    });

  const { ref: questionRef, ...questionReg } = register("question");

  const handleTranscriptChange = (text: string) => {
    setValue("question", (getValues("question") || "") + text, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = (values: FormValues) => {
    sendChat(
      values.question,
      assistantId,
      attachedFile,
      room,
      undefined,
      enableWebSearch,
      selectedModel
    );
    reset();
    setAttachedFile(null);
    setEnableWebSearch(false);
    if (textFieldRef.current) {
      textFieldRef.current.style.height = "";
    }
  };

  const handleModelSelect = (modelId: string | null) => {
    setSelectedModel(modelId);
    setShowModelPopup(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className={`absolute bottom-0 left-0 right-0 px-0 flex justify-center items-end`}
      >
        <div className="relative w-full max-w-[900px] px-4">
          {attachedFile && (
            <div className="relative z-10 mb-3">
              <FilePreview
                file={attachedFile}
                theme={theme}
                onRemove={() => setAttachedFile(null)}
              />
            </div>
          )}
          <div className="backdrop-blur-lg bg-white/35 rounded-t-xl">
            <Textarea
              id="question"
              placeholder={"Ask a question..."}
              ref={(el) => {
                questionRef(el);
                if (el) textFieldRef.current = el;
              }}
              {...questionReg}
              onInput={(e) => {
                const el = e.currentTarget as HTMLTextAreaElement;
                el.style.height = "auto";
                const maxPx = 180;
                el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`;
              }}
              onKeyDown={(e) => {
                if (e.shiftKey && e.key === "Enter") {
                  e.preventDefault();
                  const textarea = textFieldRef.current;
                  if (!textarea) return;

                  const cursorPosition = textarea.selectionStart;
                  const currentValue = getValues("question") || "";
                  const newValue =
                    currentValue.slice(0, cursorPosition) +
                    "\n" +
                    currentValue.slice(cursorPosition);

                  setValue("question", newValue, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });

                  requestAnimationFrame(() => {
                    if (textarea) {
                      textarea.focus();
                      textarea.setSelectionRange(
                        cursorPosition + 1,
                        cursorPosition + 1
                      );
                    }
                  });
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="text-white resize-none min-h-24 max-h-[12rem] w-full overflow-y-auto overflow-x-hidden focus:outline-none p-3 bg-transparent dark:bg-transparent border-0 dark:shadow-none dark:ring-0 dark:focus-visible:ring-0"
            />

            <div className="pb-3 flex items-center justify-between px-3">
              <div className="flex items-center gap-3 relative">
                <ChatFileInput
                  onFileChange={(file) => setAttachedFile(file)}
                  className="text-emerald-700"
                />
                <SearchToggleButton
                  isEnabled={enableWebSearch}
                  onToggle={() => setEnableWebSearch(!enableWebSearch)}
                />
                <VoiceButton
                  isListening={isListening}
                  onToggle={handleToggleListening}
                />
                {allowModelSelection && (
                  <Popover
                    open={showModelPopup}
                    onOpenChange={setShowModelPopup}
                  >
                    <PopoverTrigger asChild>
                      <ModelSelectorButton
                        selectedModel={selectedModel}
                        isOpen={showModelPopup}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="start"
                      sideOffset={8}
                      className="w-[400px] bg-brand-green border-none p-1"
                    >
                      <ModelSelectorPopup
                        isOpen={showModelPopup}
                        onSelect={handleModelSelect}
                        selectedModel={selectedModel}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                <div className="flex items-center gap-2" aria-label="tools" />
              </div>
              <Button
                variant={"default"}
                type="submit"
                disabled={!watch("question")?.trim()}
              >
                <FaArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VoiceToText
        onTranscriptChange={handleTranscriptChange}
        isListening={isListening}
        setIsListening={() => setIsListening(false)}
        onToggleListening={handleToggleListening}
        recognitionRef={recognitionRef}
      />
    </form>
  );
};
