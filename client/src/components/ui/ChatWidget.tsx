"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";

export function ChatWidget() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput("");
  }

  return (
    <>
      <Card className="fixed bottom-20 right-4 w-80 h-[400px] z-50 flex flex-col">
        <CardHeader>
          <CardTitle>Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className="bg-muted rounded p-2 text-sm">
                {msg}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Input
            placeholder="Votre message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
