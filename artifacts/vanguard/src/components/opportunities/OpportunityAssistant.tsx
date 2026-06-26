import { useState } from "react";
import {
  Sparkles,
  Send,
  Briefcase,
  ShoppingBag,
  Wrench,
  Landmark,
  GraduationCap,
  Users,
} from "lucide-react";

interface OpportunityAssistantProps {
  onSuggestionSelect?: (query: string) => void;
}

const suggestions = [
  {
    title: "Find me a job",
    icon: Briefcase,
    prompt: "Find jobs that match my skills.",
  },
  {
    title: "Buy or sell products",
    icon: ShoppingBag,
    prompt: "Show marketplace opportunities.",
  },
  {
    title: "Offer my services",
    icon: Wrench,
    prompt: "Find clients looking for my services.",
  },
  {
    title: "Investment opportunities",
    icon: Landmark,
    prompt: "Show verified investment opportunities.",
  },
  {
    title: "Learn a new skill",
    icon: GraduationCap,
    prompt: "Recommend courses for me.",
  },
  {
    title: "Find business partners",
    icon: Users,
    prompt: "Find trusted business partners.",
  },
];

export default function OpportunityAssistant({
  onSuggestionSelect,
}: OpportunityAssistantProps) {
  const [message, setMessage] = useState("");

  function submit(query: string) {
    if (!query.trim()) return;

    onSuggestionSelect?.(query);

    setMessage("");
  }

  return (
    <div className="rounded-2xl border bg-card p-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">

          <Sparkles className="h-6 w-6 text-primary" />

        </div>

        <div>

          <h2 className="font-bold text-xl">
            Vanguard Opportunity Assistant
          </h2>

          <p className="text-sm text-muted-foreground">
            Tell Vanguard what you're trying to achieve.
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">

        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() =>
                submit(item.prompt)
              }
              className="rounded-xl border p-4 text-left hover:border-primary hover:bg-primary/5 transition"
            >
              <Icon className="h-6 w-6 text-primary mb-3" />

              <h3 className="font-medium">
                {item.title}
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                {item.prompt}
              </p>

            </button>
          );
        })}

      </div>

      <div className="rounded-xl border p-4 bg-muted/20">

        <label className="block text-sm font-medium mb-2">
          What are you trying to achieve today?
        </label>

        <div className="flex gap-2">

          <input
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value,
              )
            }
            placeholder="Example: I need a mechanical engineering job in Lagos..."
            className="flex-1 rounded-xl border bg-background px-4 py-3"
          />

          <button
            onClick={() =>
              submit(message)
            }
            className="rounded-xl bg-primary text-primary-foreground px-5 flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Ask
          </button>

        </div>

      </div>

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">

        <h3 className="font-semibold mb-2">
          💡 Example Requests
        </h3>

        <div className="grid md:grid-cols-2 gap-2 text-sm">

          <p>• I need a trusted supplier.</p>

          <p>• Find me remote jobs.</p>

          <p>• I need investors for my business.</p>

          <p>• Show verified engineering contracts.</p>

          <p>• Recommend medical professionals.</p>

          <p>• Find customers for my services.</p>

        </div>

      </div>

    </div>
  );
}