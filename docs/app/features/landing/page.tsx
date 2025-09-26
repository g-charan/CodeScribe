"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import React, { useState } from "react";

// Shadcn UI Component Imports (for your reference when setting up)
// You would typically import these from your components/ui directory
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock Components for this single file (replace with your actual shadcn imports)

// ---------------- ICONS (Self-contained SVG components) ----------------
const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CodeScribeLogo = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15.25 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V3.64l-7.33 7.33a.75.75 0 1 1-1.06-1.06L13.44 2.5h-2.69a.75.75 0 0 1 0-1.5h3.5Z M4.75 22a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v2.69l7.33-7.33a.75.75 0 1 1 1.06 1.06L6.56 21.5h2.69a.75.75 0 0 1 0 1.5h-3.5Z" />
  </svg>
);
const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const FeatureIcon1 = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="m16.24 7.76-2.12 2.12" />
    <path d="M12 12h.01" />
  </svg>
);

const FeatureIcon2 = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.41 1.41L16.17 10H4v4h12.17l-5.58 5.59L12 21l8-8-8-8z" />
  </svg>
);

const FeatureIcon3 = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 3v18" />
  </svg>
);

// ---------------- PAGE SECTIONS ----------------

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <a href="#" className="flex items-center gap-2">
        {" "}
        {/* Replace with Next.js Link */}
        <CodeScribeLogo className="h-6 w-6" />
        <span className="font-bold text-lg">CodeScribe</span>
      </a>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <a
          href="#features"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Features
        </a>
        <a
          href="#docs"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Docs
        </a>
        <a
          href="#faq"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          FAQ
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/your-repo/codescribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <Button size="sm">Install Extension</Button>
      </div>
    </div>
  </header>
);

// const HeroSection = () => (
//   <section className="pt-32 pb-20 text-center">
//     <div className="container mx-auto px-4 md:px-6">
//       <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
//         Effortless Git Workflow.
//       </h1>
//       <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
//         CodeScribe is an AI-powered VS Code extension that automates writing
//         commit messages, PR descriptions, branch names, and more. Focus on
//         coding, not on writing about it.
//       </p>
//       <div className="flex justify-center gap-4">
//         <Button size="lg">Get Started</Button>
//         <Button size="lg" variant="outline">
//           <GithubIcon className="h-4 w-4 mr-2" />
//           View on GitHub
//         </Button>
//       </div>
//     </div>
//   </section>
// );

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-muted/40">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          As Little Hassle as Possible
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground mt-2">
          CodeScribe streamlines the most tedious parts of your development
          cycle.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <FeatureIcon1 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Automated Messaging</CardTitle>
            <CardDescription>
              Generate clear, conventional commit messages and detailed PR
              descriptions instantly from your staged changes.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <FeatureIcon2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Smart Naming</CardTitle>
            <CardDescription>
              Create descriptive, well-formatted branch names and issue titles
              from a simple description or your code changes.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <FeatureIcon3 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Seamless Integration</CardTitle>
            <CardDescription>
              Lives in your VS Code sidebar. No context switching. Just stage
              your files, click, and get what you need.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </section>
);

const DocsSection = () => (
  <section id="docs" className="py-20">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Understandable & Unobtrusive
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground mt-2">
          A quick guide to getting the most out of CodeScribe.
        </p>
      </div>
      <div className="grid md:grid-cols-[240px_1fr] gap-12">
        <aside className="hidden md:block">
          <nav className="sticky top-20 flex flex-col gap-2">
            <a href="#docs-introduction" className="font-semibold text-primary">
              Introduction
            </a>
            <a
              href="#docs-installation"
              className="text-muted-foreground hover:text-foreground"
            >
              Installation
            </a>
            <a
              href="#docs-usage"
              className="text-muted-foreground hover:text-foreground"
            >
              Usage
            </a>
            <a
              href="#docs-features"
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
          </nav>
        </aside>
        <main className="prose prose-stone dark:prose-invert max-w-none">
          <article id="docs-introduction">
            <h3>Introduction</h3>
            <p>
              CodeScribe is a VS Code extension designed to minimize the
              friction of writing about your code. It uses large language models
              to analyze your staged Git changes and generate high-quality text
              for your commits, pull requests, and more. This documentation will
              guide you through the setup and usage.
            </p>
          </article>
          <article id="docs-installation" className="mt-12">
            <h3>Installation</h3>
            <p>
              You can install CodeScribe directly from the Visual Studio
              Marketplace, or by sideloading the <code>.vsix</code> file for
              development purposes.
            </p>
            <div className="bg-muted rounded-md p-4 font-mono text-sm">
              <code>
                vsce package && code --install-extension codescribe-*.vsix
              </code>
            </div>
          </article>
          <article id="docs-usage" className="mt-12">
            <h3>Usage</h3>
            <p>
              Once installed, you'll see the CodeScribe icon in your VS Code
              Activity Bar. Open it to reveal the sidebar.
            </p>
            <ol>
              <li>Make changes to your code in a Git repository.</li>
              <li>
                Stage your changes using <code>git add .</code> or the VS Code
                UI.
              </li>
              <li>
                The "Staged Changes" panel in the CodeScribe sidebar will
                update.
              </li>
              <li>
                Click the ✨ or 📝 icons to generate a commit message or PR
                description.
              </li>
              <li>Use the "Utilities" section for branch and issue names.</li>
            </ol>
          </article>
        </main>
      </div>
    </div>
  </section>
);

const FaqSection = () => (
  <section id="faq" className="py-20 bg-muted/40">
    <div className="container max-w-3xl mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Is my code sent to a third-party server?
          </AccordionTrigger>
          <AccordionContent>
            Yes. To generate text, the `git diff` of your staged changes is sent
            to your own Vercel backend, which then queries the Google Gemini
            API. Your code is not stored or logged.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it free to use?</AccordionTrigger>
          <AccordionContent>
            CodeScribe is free for personal use. The underlying Google Gemini
            API has a generous free tier, but heavy usage may require you to set
            up billing on your Google Cloud account.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What AI model does it use?</AccordionTrigger>
          <AccordionContent>
            By default, it uses Google's `gemini-1.5-flash` for speed and
            efficiency. The codebase can be easily modified to use more powerful
            models like `gemini-1.5-pro` for handling larger, more complex code
            changes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t">
    <div className="container mx-auto flex items-center justify-between py-6 px-4 md:px-6 text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} CodeScribe. All Rights Reserved.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-foreground">
          Twitter
        </a>
        <a
          href="https://github.com/your-repo/codescribe"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

// ---------------- MAIN PAGE COMPONENT ----------------

const LandingHeader = ({ onNavigateToDocs }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <a href="#" className="flex items-center gap-2 cursor-pointer">
        <CodeScribeLogo className="h-6 w-6" />
        <span className="font-bold text-lg">CodeScribe</span>
      </a>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={onNavigateToDocs}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Docs
        </button>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/your-repo/codescribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <Button size="sm">Install Extension</Button>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="pt-32 pb-20 text-center">
    <div className="container mx-auto px-4 md:px-6">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
        Effortless Git Workflow.
      </h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
        CodeScribe is an AI-powered VS Code extension that automates writing
        commit messages, PR descriptions, and more. Focus on coding, not on
        writing about it.
      </p>
      <div className="flex justify-center gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          <GithubIcon className="h-4 w-4 mr-2" /> View on GitHub
        </Button>
      </div>
    </div>
  </section>
);

// ... other landing page sections like Features, FAQ, Footer would go here ...

const LandingPage = ({ onNavigateToDocs }) => (
  <>
    <LandingHeader onNavigateToDocs={onNavigateToDocs} />
    <main>
      <HeroSection />
      {/* You would include <FeaturesSection />, <FaqSection /> etc. here */}
    </main>
    {/* You would include <Footer /> here */}
  </>
);

// ---------------- DOCUMENTATION PAGE COMPONENTS ----------------
// To be moved to e.g., components/docs/

const DocsHeader = ({ onNavigateToHome }) => (
  <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateToHome}
          className="flex items-center gap-2 cursor-pointer"
        >
          <CodeScribeLogo className="h-6 w-6" />
          <span className="font-bold text-lg">CodeScribe</span>
        </button>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-sm hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search documentation..."
            className="pl-9 w-full h-9 rounded-md border bg-muted"
          />
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/your-repo/codescribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <Button className="md:hidden" variant="ghost" size="sm">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>
);

const DocsSidebar = ({ doc, setDoc }) => {
  const navItems = {
    "Getting Started": {
      introduction: "Introduction",
      installation: "Installation",
    },
    Usage: {
      "commit-messages": "Commit Messages",
      "pr-descriptions": "PR Descriptions",
      "name-generation": "Name Generation",
    },
  };

  return (
    <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block md:w-64">
      <div className="h-full py-6 pr-6 lg:py-8">
        <nav className="flex flex-col gap-4">
          {Object.entries(navItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold mb-2">{category}</h4>
              <div className="flex flex-col gap-1 border-l pl-4">
                {Object.entries(items).map(([slug, title]) => (
                  <button
                    key={slug}
                    onClick={() => setDoc(slug)}
                    className={`text-left text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      doc === slug ? "font-semibold text-primary" : ""
                    }`}
                  >
                    {title}
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

const DocsContent = ({ doc }) => {
  const docs = {
    introduction: (
      <article className="prose prose-stone dark:prose-invert max-w-none">
        <h1>Introduction</h1>
        <p>
          CodeScribe is a VS Code extension designed to minimize the friction of
          writing about your code. It uses large language models to analyze your
          staged Git changes and generate high-quality text for your commits,
          pull requests, and more.
        </p>
        <p>
          This documentation will guide you through the setup and usage of all
          its features, helping you integrate AI seamlessly into your
          development workflow.
        </p>
      </article>
    ),
    installation: (
      <article className="prose prose-stone dark:prose-invert max-w-none">
        <h1>Installation</h1>
        <p>
          You can install CodeScribe directly from the Visual Studio Marketplace
          for the most stable experience. For development or testing purposes,
          you can also sideload the extension.
        </p>
        <h3>From Marketplace</h3>
        <p>1. Open the Extensions view in VS Code.</p>
        <p>2. Search for "CodeScribe".</p>
        <p>3. Click "Install".</p>
        <h3>Sideloading from VSIX</h3>
        <p>
          If you have packaged the extension into a <code>.vsix</code> file, you
          can install it manually:
        </p>
        <div className="bg-muted rounded-md p-4 font-mono text-sm">
          <code>
            vsce package && code --install-extension codescribe-*.vsix
          </code>
        </div>
      </article>
    ),
    "commit-messages": (
      <article className="prose prose-stone dark:prose-invert max-w-none">
        <h1>Commit Messages</h1>
        <p>
          Generating a commit message is the core feature of CodeScribe. After
          staging your file changes, click the ✨ icon in the CodeScribe sidebar
          to generate a conventional commit message.
        </p>
      </article>
    ),
    // Add other doc pages here...
  };

  return docs[doc] || <div>Page not found.</div>;
};

const DocsLayout = ({ doc, setDoc, onNavigateToHome }) => (
  <div className="flex flex-col min-h-screen">
    <DocsHeader onNavigateToHome={onNavigateToHome} />
    <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      <DocsSidebar doc={doc} setDoc={setDoc} />
      <main className="relative py-6 lg:py-8">
        <DocsContent doc={doc} />
      </main>
    </div>
  </div>
);

// ---------------- MAIN APP COMPONENT ----------------
// This orchestrates the entire site, simulating routing.

export default function CodeScribeWebsite() {
  // 'page' state determines if we show 'landing' or 'docs'
  const [page, setPage] = useState("landing");
  // 'doc' state determines which documentation article to show
  const [doc, setDoc] = useState("introduction");

  const navigateToDocs = () => {
    setPage("docs");
    // Optionally set a default doc page when navigating
    setDoc("introduction");
  };

  const navigateToHome = () => {
    setPage("landing");
  };

  if (page === "docs") {
    return (
      <DocsLayout doc={doc} setDoc={setDoc} onNavigateToHome={navigateToHome} />
    );
  }

  return <LandingPage onNavigateToDocs={navigateToDocs} />;
}
