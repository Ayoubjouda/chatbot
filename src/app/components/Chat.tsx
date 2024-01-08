"use client";
import { FC } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

interface chatProps {}

const Chat: FC<chatProps> = ({}) => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-[min(10vw,60px)] leading-[1] text-center text-black  font-bunge max-w-3xl mt-10 z-10 "> Your Personal Chef<br/>in the Digital Era .</div>
      {/* <Accordion type="single" collapsible className="relative z-40 bg-white shadow ">
        <AccordionItem value="item-1 ">
          <div className="fixed w-[90vw] overflow-hidden left-[50%] -translate-x-[50%] bg-white border border-gray-300 rounded-xl  bottom-20">
            <div className="flex flex-col w-full h-full">
              <AccordionTrigger className="px-6 border-b border-zinc-300 rounded-t-xl">
                <ChatHeader />
              </AccordionTrigger> */}
              {/* <AccordionContent> */}
                <div className="flex flex-col p-4 border-gray-800 border-[10px] h-80 rounded-xl w-full max-w-[850px] mt-10 ">
                  <ChatMessages className="flex-1 px-2 py-3 " />
                  <ChatInput className="px-4" />
                </div>
              {/* </AccordionContent> */}
            {/* </div>
          </div>
        </AccordionItem>
      </Accordion> */}
    </div>
  );
};

export default Chat;
