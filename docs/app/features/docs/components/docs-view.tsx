"use client";
import React, { useState } from "react";
import { DocsSidebar } from "./docs-sidebar";
import { DocsContent } from "./docs-content";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TableOfContentsProps, TocItem, TocKey } from "../../landing/types";

const TableOfContents: React.FC<TableOfContentsProps> = ({ activeDoc }) => {
  const [activeSection, setActiveSection] = useState<string>("");

  const tocData: Record<TocKey, TocItem[]> = {
    introduction: [
      { id: "why-codescribe", title: "Why CodeScribe?" },
      { id: "features", title: "Features" },
    ],
    installation: [
      { id: "marketplace", title: "VS Code Marketplace" },
      { id: "manual", title: "Manual Installation" },
      { id: "configuration", title: "Configuration Required" },
    ],
    "commit-messages": [
      { id: "how-it-works", title: "How it Works" },
      { id: "usage", title: "Usage" },
      { id: "example-output", title: "Example Output" },
    ],
    "quick-start": [
      { id: "prerequisites", title: "Prerequisites" },
      { id: "first-commit", title: "First Commit Message" },
    ],
  };

  const currentToc: TocItem[] = tocData[activeDoc as TocKey] ?? [];

  return (
    <div className="fixed top-16 right-16 z-30 hidden xl:block w-64 h-[calc(100vh-4rem)]">
      <div className="h-full py-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">On this page</h4>
          <nav className="space-y-2">
            {currentToc.map((item: TocItem) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${
                  activeSection === item.id ? "text-primary font-medium" : ""
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>
          <div className="border-t pt-4">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Edit this page on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
interface DocsViewProps {
  activeDoc: string;
  setActiveDoc: (doc: string) => void;
}

const DocsView: React.FC<DocsViewProps> = ({ activeDoc, setActiveDoc }) => {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-64">
        <DocsSidebar activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
      </div>
      {/* Main Content */}
      <main className="flex-1 h-fit w-full border-l overflow-y-auto min-w-0 xl:pr-80">
        <div className="container max-w-4xl px-6 py-8 md:px-8 lg:px-12">
          <DocsContent activeDoc={activeDoc as TocKey} />
        </div>
      </main>

      {/* Table of Contents */}
      <TableOfContents activeDoc={activeDoc} />
    </div>
  );
};

export default DocsView;
