import { CSSProperties } from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonTextProps } from './Skeleton.types';

export function SkeletonText({
  lines = 3,
  lastLineWidth = '75%',
  disableAnimation = false,
  className,
}: SkeletonTextProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1;
        const wrapperStyle: CSSProperties = {
          marginBottom: !isLastLine ? '0.5em' : undefined,
        };

        return (
          <div key={index} style={wrapperStyle}>
            <Skeleton
              variant="text"
              width={isLastLine ? lastLineWidth : undefined}
              disableAnimation={disableAnimation}
            />
          </div>
        );
      })}
    </div>
  );
}
