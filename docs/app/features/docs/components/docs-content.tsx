import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureCard } from "../../landing/components/feature-card";
import { Check, Globe, Settings, Sparkles, Zap } from "lucide-react";
import { CodeBlock } from "@/app/core/components/codeblock";
import { TocKey } from "../../landing/types";

interface DocsContentProps {
  activeDoc: TocKey;
}

// Documentation Content
export const DocsContent = ({ activeDoc }: DocsContentProps) => {
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
