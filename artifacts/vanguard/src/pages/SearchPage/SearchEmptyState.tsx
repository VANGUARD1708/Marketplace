import { Search, TrendingUp } from "lucide-react";

type SearchEmptyStateProps = {
  query: string;
  onSuggestionClick: (term: string) => void;
};

const RELATED_SEARCHES: Record<string, string[]> = {
  phone: ["iPhone 14", "Samsung Galaxy", "Tecno Camon", "Infinix Note"],
  laptop: ["MacBook Pro", "Dell XPS", "HP EliteBook", "Lenovo ThinkPad"],
  car: ["Toyota Camry", "Honda Accord", "Ford Explorer", "Lexus ES 350"],
  house: ["3 bedroom flat", "duplex Lagos", "land Abuja", "studio apartment"],
};

export function SearchEmptyState({ query, onSuggestionClick }: SearchEmptyStateProps) {
  const lowerQuery = query.toLowerCase();
  const relatedKey = Object.keys(RELATED_SEARCHES).find((k) => lowerQuery.includes(k));
  const related = relatedKey ? RELATED_SEARCHES[relatedKey] : [];

  return (
    <div className="text-center py-12">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">No results for "{query}"</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        Try different keywords, check your spelling, or browse by category.
      </p>

      {related.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4" /> Try these instead
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {related.map((term) => (
              <button
                key={term}
                onClick={() => onSuggestionClick(term)}
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {[
          { label: "Browse Marketplace", href: "/marketplace" },
          { label: "Find Services", href: "/services" },
          { label: "Explore Jobs", href: "/jobs" },
          { label: "View Courses", href: "/courses" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="px-3 py-2 rounded-xl border text-xs font-medium hover:bg-muted transition text-center"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default SearchEmptyState;
