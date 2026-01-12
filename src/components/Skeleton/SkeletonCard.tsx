import { Card } from '../Card';
import { Skeleton } from './Skeleton';
import type { SkeletonCardProps } from './Skeleton.types';
import { Stack } from '../Stack';

export function SkeletonCard({
  variant = 'raised',
  hasImage = false,
  hasActions = false,
  disableAnimation = false,
  className,
}: SkeletonCardProps) {
  return (
    <Card variant={variant} className={className}>
      <Stack spacing={3}>
        {hasImage && (
          <Skeleton
            variant="rect"
            height={200}
            disableAnimation={disableAnimation}
          />
        )}

        <Skeleton
          variant="text"
          width="90%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="85%"
          disableAnimation={disableAnimation}
        />

        <Skeleton
          variant="text"
          width="95%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="88%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="60%"
          disableAnimation={disableAnimation}
        />

        {hasActions && (
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="rect"
              width={80}
              height={36}
              borderRadius={6}
              disableAnimation={disableAnimation}
            />
            <Skeleton
              variant="rect"
              width={80}
              height={36}
              borderRadius={6}
              disableAnimation={disableAnimation}
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
