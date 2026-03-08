import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      <p className="mt-4 text-sm text-gray-500">Yukleniyor...</p>
    </div>
  )
}
