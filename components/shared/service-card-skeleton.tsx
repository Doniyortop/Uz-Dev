import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ServiceCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-dark-700 overflow-hidden">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-4 right-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Skeleton className="h-6 flex-1 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded mb-2" />
        <Skeleton className="h-4 w-3/4 rounded mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-dark-700 mt-auto">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-9 w-16 rounded" />
      </CardFooter>
    </Card>
  );
}
