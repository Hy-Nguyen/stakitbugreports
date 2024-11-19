import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BugListSkeleton() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="mb-4 flex items-start justify-between lg:mb-0">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-6  w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
