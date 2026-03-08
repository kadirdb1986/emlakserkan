import Link from 'next/link'
import { TreePine, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-50 px-4">
      <div className="text-center">
        {/* Nature icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary-100 p-6">
            <TreePine className="h-16 w-16 text-primary-600" />
          </div>
        </div>

        {/* 404 heading */}
        <h1 className="mb-2 text-8xl font-bold text-primary-700">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Sayfa Bulunamadi
        </h2>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          Aradiginiz sayfa mevcut degil veya tasinmis olabilir. Ana sayfaya
          donerek aramaniza devam edebilirsiniz.
        </p>

        {/* Back to home button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
        >
          <Home className="h-5 w-5" />
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  )
}
