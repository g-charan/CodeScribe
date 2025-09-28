"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { BookOpen } from "lucide-react";
type SearchResult = { title: string; type: string; path: string };

type SearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const mockResults = [
    { title: "Getting Started", type: "Guide", path: "introduction" },
    { title: "Commit Messages", type: "Feature", path: "commit-messages" },
    { title: "Installation", type: "Setup", path: "installation" },
    { title: "API Reference", type: "Reference", path: "api" },
  ];

  useEffect(() => {
    if (query.trim()) {
      setResults(
        mockResults.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
      <div className="bg-background rounded-xl shadow-2xl border w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <Input
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 h-12"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground ml-2">
            ESC
          </kbd>
        </div>
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.type}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
        <div className="border-t p-3 text-xs text-muted-foreground flex items-center justify-between">
          <div>Type to search</div>
          <div className="flex items-center gap-4">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
              <Command className="h-3 w-3" />K
            </kbd>
            <span>to open</span>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};
