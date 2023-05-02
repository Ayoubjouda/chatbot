"use client";

import { cn } from "@/app/lib/utils";
import { Message } from "@/app/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";
import { FC, HtmlHTMLAttributes, useContext, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { MessagesContext } from "../context/messages";
import { toast } from "react-hot-toast";
import { CornerDownLeft, Loader2 } from "lucide-react";

interface ChatInputProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [Input, setInput] = useState<string>("");
  const { messages, addMessage, removeMessage, updateMessage, setIsMessageUpdating } = useContext(MessagesContext);
  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [message] }),
      });
      if (!response.ok) {
        throw new Error();
      }

      return response.body;
    },
    onMutate(message) {
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("no Stream");

      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserInput: false,
        text: "",
      };

      // add new message to state
      addMessage(responseMessage);

      setIsMessageUpdating(true);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }
      setIsMessageUpdating(false);
      setInput("");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      toast.error("Something went wrong. Please try again.");
      removeMessage(message.id);
      textareaRef.current?.focus();
    },
  });
  return (
    <div {...props} className={cn("border-t border-zinc-300")}>
      <div className="relative flex-1 mt-4 overflow-hidden border-none rounded-lg outline-none">
        <TextareaAutosize
          ref={textareaRef}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const message = {
                id: nanoid(),
                isUserInput: true,
                text: Input,
              };
              sendMessage(message);
            }
          }}
          maxRows={4}
          value={Input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
          placeholder="Write a message"
          className="block w-full border-0 resize-none peer disabled:opacity-50 pr-14 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm leading-6"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center px-1 font-sans text-xs text-gray-400 bg-white border border-gray-200 rounded">
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CornerDownLeft className="w-3 h-3" />}
          </kbd>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ChatInput;
