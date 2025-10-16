import { Button } from "@/components/ui/button";
import { Command, Github, Search } from "lucide-react";
import { NavigationHeaderProps } from "../types";

const CodeScribeLogo = ({ className = "h-6 w-6", variant = "default" }) => (
  <div className="flex items-center gap-2">
    <div className={`${className} relative`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg opacity-10 blur-sm"></div>
      <svg
        className={`${className} relative z-10`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 3L4 14h7l-1 8 9-11h-7l1-8z"
          fill="url(#gradient)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    {variant === "full" && (
      <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        CodeScribe
      </span>
    )}
  </div>
);

// Navigation Components

export const NavigationHeader = ({
  onSearchOpen,
  onNavigate,
  currentPage,
}: NavigationHeaderProps) => (
  <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto flex h-16 items-center">
      <div className="mr-4 hidden md:flex">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <CodeScribeLogo variant="full" />
        </button>
      </div>

      <nav className="flex items-center space-x-6 text-sm font-medium">
        <button
          onClick={() => onNavigate("docs")}
          className={`transition-colors hover:text-foreground/80 ${
            currentPage === "docs" ? "text-foreground" : "text-foreground/60"
          }`}
        >
          Documentation
        </button>
        <a
          href="#"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
        >
          Examples
        </a>
        <a
          href="#"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
        >
          Changelog
        </a>
      </nav>

      <div className="flex flex-1 items-center justify-end space-x-2">
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
          onClick={onSearchOpen}
        >
          <Search className="mr-2 h-4 w-4" />
          Search docs...
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/g-charan/CodeScribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </div>
    </div>
  </header>
);
