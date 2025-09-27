"use client";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

export const DocsSidebar = ({ activeDoc, setActiveDoc }) => {
  const navigation = [
    {
      title: "Getting Started",
      items: [
        { id: "introduction", title: "Introduction" },
        { id: "installation", title: "Installation" },
        { id: "quick-start", title: "Quick Start" },
      ],
    },
    {
      title: "Core Features",
      items: [
        { id: "commit-messages", title: "Commit Messages" },
        { id: "pr-descriptions", title: "PR Descriptions" },
        { id: "branch-naming", title: "Branch Naming" },
      ],
    },
    {
      title: "Advanced",
      items: [
        { id: "configuration", title: "Configuration" },
        { id: "api-reference", title: "API Reference" },
      ],
    },
  ];

  return (
    <aside className="pl-10 z-30 hidden fixed left-0 top-16  xl:block w-full md:w-64">
      <div className="h-full py-6 pr-6 lg:py-8">
        <nav className="flex flex-col gap-4">
          {navigation.map((section, i) => (
            <div key={section.title}>
              <h4 className="font-bold mb-2">{section.title}</h4>
              <div className="flex flex-col gap-1 border-l pl-4">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDoc(item.id)}
                    className={`text-left text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      activeDoc === item.id ? "font-semibold text-primary" : ""
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
