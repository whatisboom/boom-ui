import { ReactNode } from 'react';

export interface SearchResult {
  id: string;
  category?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  results: SearchResult[];
  isLoading?: boolean;
  recentSearches?: SearchResult[];
  placeholder?: string;
  emptyMessage?: string;
}
