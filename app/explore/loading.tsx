import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-64">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}