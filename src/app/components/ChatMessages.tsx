"use client";
import { FC, HtmlHTMLAttributes, useContext } from "react";
import { MessagesContext } from "../context/messages";
import { cn } from "../lib/utils";
import MarkdownLite from "./MarkdounLite";

interface ChatMessagesProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const { messages } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ",
        className
      )}
    >
      <div className="flex-1 flex-grow" />
      {inverseMessages.map((message) => {
        return (
          <div className="chat-message" key={`${message.id}-${message.id}`}>
            <div
              className={cn("flex items-end ", {
                "justify-end": message.isUserInput,
              })}
            >
              <div
                className={cn("flex flex-col space-y-2 text-sm max-w-2xl mx-2 overflow-x-hidden ", {
                  "order-1 items-end": message.isUserInput,
                  "order-2 items-start": !message.isUserInput,
                })}
              >
                <p
                  className={cn("px-4 py-2 rounded-xl", {
                    "bg-black text-white": message.isUserInput,
                    "bg-gray-200 text-gray-900": !message.isUserInput,
                  })}
                >
                  <MarkdownLite text={message.text} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
