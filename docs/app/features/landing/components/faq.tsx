import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => (
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
