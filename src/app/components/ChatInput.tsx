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
    <div {...props} className={cn("border-t border-zinc-300 rounded-lg")}>
      <div className="relative flex-1 mt-4 overflow-hidden rounded-lg outline-none ">
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
          className="block w-full rounded-xl border-0 resize-none peer disabled:opacity-50 pr-14 bg-black py-1.5 text-white focus:ring-0  placeholder:text-gray-400 text-sm leading-6  "
        />
        <div className="absolute inset-y-0 border-0 right-0 flex py-1.5 pr-1.5  rounded-full " >
          <kbd className="inline-flex items-center px-1 font-sans text-xs rounded-lg bg-blacktext-gray-400">
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CornerDownLeft className="w-3 h-3 " />}
          </kbd>
        </div>

       
      </div>
    </div>
  );
};

export default ChatInput;
