"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import React, { useState, useEffect } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import { Check } from "lucide-react";
import { SearchDialog } from "@/app/core/components/search-dialog";
import { NavigationHeader } from "@/app/features/landing/components/navigation-header";
import { FeaturesGrid } from "@/app/features/landing/components/feature-grid";
import { FAQSection } from "@/app/features/landing/components/faq";
import DocsView from "@/app/features/docs/components/docs-view";

type NavigationProps = {
  onNavigate: (page: string) => void;
};

// Landing Page Components
const HeroSection = ({ onNavigate }: NavigationProps) => (
  <section className="container mx-auto px-4 py-24 md:py-32">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <Badge variant="outline" className="text-sm font-normal">
          ✨ AI-Powered Git Workflow
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Effortless Git Workflow
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          CodeScribe automates writing commit messages, PR descriptions, and
          branch names. Focus on coding, not on writing about it.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={() => onNavigate("docs")}
          className="text-base px-8"
        >
          Get Started
        </Button>
        <Button size="lg" variant="outline" asChild className="text-base px-8">
          <a
            href="https://github.com/your-repo/codescribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  </section>
);

const CTA = ({ onNavigate }: NavigationProps) => (
  <section className="container mx-auto px-4 py-24">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to transform your Git workflow?
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={() => onNavigate("docs")}
          asChild
          className="text-base px-8"
        >
          <a href="/app/codescribe-0.0.14.vsix" download>
            Install Now
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild className="text-base px-8">
          <a
            href="https://github.com/your-repo/codescribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            Star on GitHub
          </a>
        </Button>
      </div>
    </div>
  </section>
);

// Main App Component
export default function CodeScribeLanding() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeDoc, setActiveDoc] = useState("introduction");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === "docs") {
      setActiveDoc("introduction");
    }
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-full bg-background text-foreground">
      <NavigationHeader
        onSearchOpen={handleSearchOpen}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <SearchDialog isOpen={isSearchOpen} onClose={handleSearchClose} />

      {currentPage === "home" ? (
        <main className=" min-h-full flex flex-col">
          <HeroSection onNavigate={handleNavigate} />
          <FeaturesGrid />
          <FAQSection />
          <CTA onNavigate={handleNavigate} />
        </main>
      ) : (
        <div className="h-full">
          <DocsView activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
        </div>
      )}
    </div>
  );
}
