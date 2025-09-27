"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({ children, language = "bash", title }) => (
  <div className="group relative">
    {title && (
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50 text-sm font-mono">
        <Terminal className="h-3 w-3" />
        {title}
      </div>
    )}
    <div className="relative bg-muted/30 border rounded-lg overflow-hidden">
      <pre className="p-4 text-sm font-mono overflow-x-auto">
        <code>{children}</code>
      </pre>
      <CopyButton code={children} />
    </div>
  </div>
);

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2 h-8 w-8 p-0"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
};
