import { Clock, X, TrendingUp } from "lucide-react";

type SearchHistoryProps = {
  history: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
};

export function SearchHistory({ history, onSelect, onRemove, onClearAll }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Recent Searches
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((term) => (
          <div key={term} className="flex items-center gap-1 border rounded-full pl-3 pr-1 py-1.5 text-xs bg-card hover:bg-muted transition">
            <button onClick={() => onSelect(term)} className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {term}
            </button>
            <button
              onClick={() => onRemove(term)}
              className="p-0.5 rounded-full hover:bg-muted-foreground/20 transition ml-1"
              aria-label={`Remove ${term}`}
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;
