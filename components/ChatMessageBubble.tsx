"use client";
import { useState } from 'react';
import type { Message } from "ai/react";

interface ChatMessageBubbleProps {
  message: Message;
  aiEmoji?: string;
  openTransactionModal: any; // Callback function to handle unlocking the message
  modalState: boolean; 
}

type ParsedResponse = {
  output: string;
  sources: {
    authorAddress: string;
    nftAddress: string;
    costPerWord: number;
  };
};

// Function to parse response and extract output and sources
function separateOutputAndSources(data: string): ParsedResponse | undefined {
  try {
    const jsonData: { output: string; sources: any } = JSON.parse(data);
    if (!jsonData.output || !jsonData.sources) {
      return undefined; // Handle invalid data
    }

    const sources = {
      authorAddress: jsonData.sources.authorAddress,
      nftAddress: jsonData.sources.nftAddress,
      costPerWord: jsonData.sources.costPerWord,
    };

    return { output: jsonData.output, sources };
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return undefined; // Handle parsing errors
  }
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [showFullMessage, setShowFullMessage] = useState(false);

  const colorClassName =
    message.role === "user" ? "chat-bubble-secondary text-black" : "chat-bubble-primary text-black";
  const alignmentClassName =
    message.role === "user" ? "ml-auto" : "mr-auto";
  const prefix = message.role === "user" ? "🧑" : "🤖";

  const messageContent = message.role === "user" ? message.content : separateOutputAndSources(message.content)?.output;
  const sources = message.role === "user" ? [] : separateOutputAndSources(message.content)?.sources;
  const words = messageContent?.split(" ");


 
  return (
    <div className={`${alignmentClassName} ${colorClassName} chat-bubble rounded px-4 py-2 max-w-[80%] mb-8 flex`}>
      <div className="mr-2">
        {prefix}
      </div>
      <div className="whitespace-pre-wrap flex flex-col">
        <span>
          {messageContent}
         
        </span>
        {sources && sources?.nftAddress && words?.length > 200 ? ( // Adjusted to check if sources exist and get the first source's nftAddress
          <>
            <code className="mt-4 mr-auto bg-sky-200 px-2 py-1 rounded text-sm">
              <h2>Sources:</h2>
            </code>
            <code className="mt-1 mr-2 bg-sky-100 px-2 py-1 rounded text-xs">
              <div className="mt-2">
                {sources?.nftAddress} 
              </div>
            </code>
          </>
        ) : null}
      </div>
    </div>
  );
}
