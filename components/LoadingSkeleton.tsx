import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
	return (
		<div className="container mx-auto p-4 space-y-4">
			<Skeleton className="h-12 w-64 mx-auto" />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<Skeleton className="h-96 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
				<div className="space-y-8">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		</div>
	)
}