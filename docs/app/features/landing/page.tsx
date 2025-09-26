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
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {
  Search,
  Github,
  Menu,
  ChevronRight,
  BookOpen,
  Zap,
  Settings,
  Globe,
  ArrowUpRight,
  Copy,
  Check,
  Command,
  Terminal,
  Sparkles,
  Code2,
  GitBranch,
  FileText,
  ExternalLink,
} from "lucide-react";

// Enhanced Logo Component
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

// Enhanced Search Component
const SearchDialog = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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

// Copy Code Button Component
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

// Code Block Component
const CodeBlock = ({ children, language = "bash", title }) => (
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

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, href, badge }) => (
  <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border-muted/50 hover:border-primary/20">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription className="leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
    {href && (
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-primary hover:text-primary/80"
        >
          Learn more <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    )}
  </Card>
);

// Navigation Components
const NavigationHeader = ({ onSearchOpen, onNavigate, currentPage }) => (
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
            href="https://github.com/your-repo/codescribe"
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

// Sidebar Navigation
const DocsSidebar = ({ activeDoc, setActiveDoc }) => {
  const navigation = [
    {
      title: "Getting Started",
      items: [
        { id: "introduction", title: "Introduction", icon: BookOpen },
        { id: "installation", title: "Installation", icon: Settings },
        { id: "quick-start", title: "Quick Start", icon: Zap },
      ],
    },
    {
      title: "Core Features",
      items: [
        { id: "commit-messages", title: "Commit Messages", icon: GitBranch },
        { id: "pr-descriptions", title: "PR Descriptions", icon: FileText },
        { id: "branch-naming", title: "Branch Naming", icon: Code2 },
      ],
    },
    {
      title: "Advanced",
      items: [
        { id: "configuration", title: "Configuration", icon: Settings },
        { id: "api-reference", title: "API Reference", icon: Terminal },
      ],
    },
  ];

  return (
    <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
        <div className="h-full w-full rounded-[inherit]">
          <nav className="relative h-full w-full">
            {navigation.map((section, i) => (
              <div key={section.title} className={i > 0 ? "mt-8" : ""}>
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  {section.title}
                </h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveDoc(item.id)}
                      className={`group flex items-center rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
                        activeDoc === item.id
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

// Documentation Content
const DocsContent = ({ activeDoc }) => {
  const docs = {
    introduction: (
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered VS Code extension that automates your Git workflow with
            intelligent commit messages, PR descriptions, and branch naming.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">v2.1.0</Badge>
          <Badge variant="outline">Stable</Badge>
        </div>
        <Separator />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            CodeScribe eliminates the friction of writing about your code by
            leveraging large language models to analyze your staged Git changes
            and generate high-quality, conventional commit messages, detailed
            pull request descriptions, and meaningful branch names.
          </p>
          <h3>Why CodeScribe?</h3>
          <p>
            Modern development workflows require consistent, descriptive commit
            messages and documentation. CodeScribe ensures your Git history
            remains clean and informative without interrupting your flow state.
          </p>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Generation"
              description="Leverages Google Gemini to analyze your code changes and generate contextually relevant text."
            />
            <FeatureCard
              icon={Zap}
              title="Seamless Integration"
              description="Works directly in VS Code sidebar - no context switching or external tools required."
            />
            <FeatureCard
              icon={Settings}
              title="Highly Configurable"
              description="Customize prompts, conventions, and AI models to match your team's workflow."
            />
            <FeatureCard
              icon={Globe}
              title="Privacy Focused"
              description="Your code diffs are processed securely through your own backend deployment."
            />
          </div>
        </div>
      </div>
    ),
    installation: (
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
          <p className="text-xl text-muted-foreground">
            Get CodeScribe running in your VS Code environment in under 2
            minutes.
          </p>
        </div>
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketplace">VS Code Marketplace</TabsTrigger>
            <TabsTrigger value="manual">Manual Installation</TabsTrigger>
          </TabsList>
          <TabsContent value="marketplace" className="space-y-4 pt-4">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Install directly from the Visual Studio Code Marketplace for the
                most stable experience.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Open VS Code Extensions</p>
                  <p className="text-sm text-muted-foreground">
                    Press <kbd>Ctrl+Shift+X</kbd> (Windows/Linux) or{" "}
                    <kbd>Cmd+Shift+X</kbd> (Mac)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Search for "CodeScribe"</p>
                  <p className="text-sm text-muted-foreground">
                    Look for the extension published by your team.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Click Install</p>
                  <p className="text-sm text-muted-foreground">
                    The extension will be activated automatically.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                For development or testing purposes, you can install from a VSIX
                file.
              </p>
            </div>
            <CodeBlock language="bash" title="Terminal">
              {`# Package the extension
vsce package

# Install the generated VSIX file
code --install-extension codescribe-*.vsix`}
            </CodeBlock>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Settings className="h-4 w-4" />
                Configuration Required
              </div>
              <p className="text-sm text-muted-foreground">
                After installation, you'll need to configure your API keys and
                backend endpoint. See the 'Configuration' section for details.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    ),
    "commit-messages": (
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Commit Messages</h1>
          <p className="text-xl text-muted-foreground">
            Generate conventional, descriptive commit messages from your staged
            changes automatically.
          </p>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>How it Works</h3>
          <p>
            CodeScribe analyzes your staged Git changes and generates commit
            messages that follow conventional commit standards. The AI
            understands context, identifies the type of changes, and creates
            concise yet descriptive messages.
          </p>
          <h3>Usage</h3>
          <ol>
            <li>
              Stage your changes using <code>git add</code> or VS Code's Git
              panel.
            </li>
            <li>Open the CodeScribe sidebar in VS Code.</li>
            <li>Click the ✨ icon next to "Generate Commit Message".</li>
            <li>Review and optionally edit the generated message.</li>
            <li>Commit directly from the extension or copy to Git panel.</li>
          </ol>
          <h3>Example Output</h3>
        </div>
        <div className="space-y-4">
          <CodeBlock language="text" title="Generated Commit Message">
            {`feat(auth): implement OAuth2 Google sign-in

- Add Google OAuth2 configuration
- Create user authentication middleware
- Update login page with Google sign-in button
- Add user session management

Closes #123`}
          </CodeBlock>
        </div>
      </div>
    ),
    "quick-start": (
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Quick Start</h1>
          <p className="text-xl text-muted-foreground">
            Get up and running with CodeScribe in your first project.
          </p>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>Prerequisites</h3>
          <ul>
            <li>VS Code 1.74.0 or higher</li>
            <li>Git repository initialized</li>
            <li>Google Cloud API key (free tier available)</li>
          </ul>
          <h3>First Commit Message</h3>
          <p>Let's generate your first AI-powered commit message:</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
              1
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">Make changes to your code</h4>
              <CodeBlock language="javascript" title="example.js">
                {`function greetUser(name) {
  return \`Hello, \${name}!\`;
}

export default greetUser;`}
              </CodeBlock>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
              2
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">Stage your changes</h4>
              <CodeBlock language="bash">{`git add example.js`}</CodeBlock>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
              3
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">Open CodeScribe and generate</h4>
              <p className="text-muted-foreground">
                Click the CodeScribe icon in your VS Code sidebar, then click
                the ✨ button to generate a commit message.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
              4
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">Result</h4>
              <CodeBlock language="text">
                {`feat: add user greeting function

Create greetUser function with template literal
for personalized user messages`}
              </CodeBlock>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-green-50 dark:bg-green-950/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            <Check className="h-4 w-4" />
            Success!
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            You've generated your first AI-powered commit message. The extension
            is now ready for your daily workflow.
          </p>
        </div>
      </div>
    ),
  };
  return (
    docs[activeDoc] || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
        <p className="text-muted-foreground">
          The requested documentation page could not be found.
        </p>
      </div>
    )
  );
};

// Landing Page Components
const HeroSection = ({ onNavigate }) => (
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

const FeaturesGrid = () => (
  <section className="container mx-auto px-4 py-24">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Everything you need for a better Git workflow
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline the most tedious parts of your development cycle with
          AI-powered automation.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Sparkles}
          title="Smart Commit Messages"
          description="Generate conventional commit messages that perfectly describe your staged changes with proper scope and type detection."
          badge="Core"
        />
        <FeatureCard
          icon={FileText}
          title="Detailed PR Descriptions"
          description="Create comprehensive pull request descriptions with change summaries, testing instructions, and impact analysis."
        />
        <FeatureCard
          icon={GitBranch}
          title="Intelligent Branch Naming"
          description="Get descriptive, well-formatted branch names that follow your team's conventions from simple descriptions."
        />
        <FeatureCard
          icon={Code2}
          title="Code Analysis"
          description="Deep understanding of your code changes with context-aware suggestions and conventional commit standards."
        />
        <FeatureCard
          icon={Settings}
          title="Highly Configurable"
          description="Customize prompts, AI models, and output formats to match your team's workflow and standards perfectly."
        />
        <FeatureCard
          icon={Terminal}
          title="VS Code Native"
          description="Fully integrated into VS Code sidebar with keyboard shortcuts and seamless Git workflow integration."
        />
      </div>
    </div>
  </section>
);

const FAQSection = () => (
  <section className="container mx-auto px-4 py-24">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does CodeScribe handle my code privacy?
          </AccordionTrigger>
          <AccordionContent>
            CodeScribe processes your code diffs through your own backend
            deployment. Your code never leaves your infrastructure, and we use
            secure API calls to Google's Gemini API with your own API keys.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Which AI models does CodeScribe support?
          </AccordionTrigger>
          <AccordionContent>
            Currently, CodeScribe supports Google's Gemini models. We're working
            on adding support for OpenAI GPT models and local models like Ollama
            in future updates.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Can I customize the commit message format?
          </AccordionTrigger>
          <AccordionContent>
            Yes! CodeScribe is highly configurable. You can customize prompts,
            commit conventions, and output formats through the extension
            settings or a configuration file.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is there a free tier available?</AccordionTrigger>
          <AccordionContent>
            CodeScribe itself is free and open-source. You'll need to provide
            your own Google Cloud API key, which offers a generous free tier
            that should be sufficient for most developers.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

const CTA = ({ onNavigate }) => (
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
          className="text-base px-8"
        >
          Install Now
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

  const handleNavigate = (page) => {
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
    const handleKeyDown = (event) => {
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
    <div className="min-h-screen bg-background text-foreground">
      <NavigationHeader
        onSearchOpen={handleSearchOpen}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <SearchDialog isOpen={isSearchOpen} onClose={handleSearchClose} />

      {currentPage === "home" ? (
        <main>
          <HeroSection onNavigate={handleNavigate} />
          <FeaturesGrid />
          <FAQSection />
          <CTA onNavigate={handleNavigate} />
        </main>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64">
              <DocsSidebar activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
            </div>
            <main className="flex-1 min-w-0">
              <div className="max-w-3xl">
                <DocsContent activeDoc={activeDoc} />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
