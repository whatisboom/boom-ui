import type { KeyboardEvent } from 'react';
import { useTabsContext } from './TabsContext';
import type { TabListProps } from './Tabs.types';
import { cn } from '@/utils/classnames';
import styles from './Tabs.module.css';

export const TabList = ({ children, className }: TabListProps) => {
  const { orientation, tabValues, disabledTabs, setActiveTab } = useTabsContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabValues.findIndex(
      (value) => document.activeElement?.getAttribute('data-value') === value
    );

    if (currentIndex === -1) {return;}

    let nextIndex = currentIndex;
    const enabledTabs = tabValues.filter((v) => !disabledTabs.has(v));
    const currentIndexInEnabled = enabledTabs.indexOf(tabValues[currentIndex]);

    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        nextIndex = (currentIndexInEnabled + 1) % enabledTabs.length;
        setActiveTab(enabledTabs[nextIndex]);
        break;

      case prevKey:
        event.preventDefault();
        nextIndex =
          (currentIndexInEnabled - 1 + enabledTabs.length) % enabledTabs.length;
        setActiveTab(enabledTabs[nextIndex]);
        break;

      case 'Home':
        event.preventDefault();
        setActiveTab(enabledTabs[0]);
        break;

      case 'End':
        event.preventDefault();
        setActiveTab(enabledTabs[enabledTabs.length - 1]);
        break;
    }
  };

  return (
    // Individual tabs are focusable, not the tablist container
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(styles.tabList, styles[orientation], className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

TabList.displayName = 'TabList';
