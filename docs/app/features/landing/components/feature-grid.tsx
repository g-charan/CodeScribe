import {
  Code2,
  FileText,
  GitBranch,
  Settings,
  Sparkles,
  Terminal,
} from "lucide-react";
import { FeatureCard } from "./feature-card";

export const FeaturesGrid = () => (
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
