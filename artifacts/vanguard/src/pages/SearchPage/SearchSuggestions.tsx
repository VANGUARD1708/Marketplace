import { TrendingUp, Search } from "lucide-react";

type SearchSuggestionsProps = {
  query: string;
  suggestions: string[];
  onSelect: (term: string) => void;
};

const POPULAR_SEARCHES = [
  "iPhone", "MacBook", "Laptop", "Generator", "Car",
  "Samsung", "Shoes", "Apartment", "Solar Panel", "Inverter",
];

export function SearchSuggestions({ query, suggestions, onSelect }: SearchSuggestionsProps) {
  const items = suggestions.length > 0 ? suggestions : POPULAR_SEARCHES;
  const isPopular = suggestions.length === 0;

  return (
    <div className="rounded-2xl border bg-card shadow-lg overflow-hidden">
      <div className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {isPopular ? (
          <>
            <TrendingUp className="h-3.5 w-3.5" />
            Popular Searches
          </>
        ) : (
          <>
            <Search className="h-3.5 w-3.5" />
            Suggestions
          </>
        )}
      </div>

      <ul>
        {items.slice(0, 8).map((item, i) => (
          <li key={i}>
            <button
              onClick={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition"
            >
              {isPopular ? (
                <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span>
                {query ? (
                  <>
                    <span className="font-medium">{query}</span>
                    {item.toLowerCase().startsWith(query.toLowerCase()) ? item.slice(query.length) : ` → ${item}`}
                  </>
                ) : (
                  item
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchSuggestions;
