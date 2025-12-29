import { useState, useRef, useEffect, useMemo } from 'react';
import { Modal } from '../primitives/Modal';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchCommandProps, SearchResult } from './SearchCommand.types';
import styles from './SearchCommand.module.css';

export function SearchCommand({
  isOpen,
  onClose,
  onSearch,
  results,
  isLoading = false,
  recentSearches = [],
  placeholder = 'Search...',
  emptyMessage = 'No results found',
}: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const displayResults = query ? results : recentSearches;

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};

    displayResults.forEach((result) => {
      const category = result.category || 'Results';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
    });

    return groups;
  }, [displayResults]);

  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [flatResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          flatResults[selectedIndex].onSelect();
          onClose();
        }
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    result.onSelect();
    onClose();
  };

  let resultIndex = 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnClickOutside={true}
      closeOnEscape={true}
    >
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.resultsContainer}>
          {isLoading ? (
            <div className={styles.loadingState}>Searching...</div>
          ) : displayResults.length === 0 && query ? (
            <div className={styles.emptyState}>{emptyMessage}</div>
          ) : (
            Object.entries(groupedResults).map(([category, categoryResults]) => (
              <div key={category}>
                <div className={styles.category}>{category}</div>
                <ul className={styles.resultsList}>
                  {categoryResults.map((result) => {
                    const currentIndex = resultIndex++;
                    return (
                      <li key={result.id}>
                        <button
                          className={styles.resultItem}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          ref={
                            selectedIndex === currentIndex
                              ? (el) => el?.focus()
                              : undefined
                          }
                        >
                          {result.icon && (
                            <div className={styles.resultIcon}>{result.icon}</div>
                          )}
                          <div className={styles.resultContent}>
                            <div className={styles.resultTitle}>
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className={styles.resultSubtitle}>
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>↑↓</span>
            <span>Navigate</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>Enter</span>
            <span>Select</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>Esc</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
