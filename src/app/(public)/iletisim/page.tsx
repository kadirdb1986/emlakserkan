import type { Metadata } from 'next'
import { Phone, MapPin, TreePine } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İletişim | Emlak Serkan',
  description:
    'Emlak Serkan ile iletişime geçin. Arsa, ev, villa ve tarla satışı için bizi arayın. Telefon: 0 539 773 62 55',
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
          <Phone className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          İletişim
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary-500" />
        <p className="mt-4 text-lg text-gray-600">
          Hayalinizdeki mülkü bulmak için bizimle iletişime geçin.
        </p>
      </div>

      {/* Contact card */}
      <div className="mx-auto mt-12 max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-lg">
          {/* Green header band */}
          <div className="bg-primary-600 px-6 py-8 text-center text-white">
            <TreePine className="mx-auto h-10 w-10 text-primary-200" />
            <h2 className="mt-3 text-xl font-bold">Emlak Serkan</h2>
            <p className="mt-1 text-sm text-primary-100">
              Serkan Güner - Emlak Danışmanı
            </p>
          </div>

          {/* Contact details */}
          <div className="p-6 sm:p-8">
            {/* Phone */}
            <div className="text-center">
              <a
                href="tel:+905397736255"
                className="group inline-flex flex-col items-center gap-3 rounded-xl bg-primary-50 px-8 py-6 transition-colors hover:bg-primary-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 transition-transform group-hover:scale-110">
                  <Phone className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-wide text-primary-700 sm:text-3xl">
                  0 539 773 62 55
                </span>
              </a>
              <p className="mt-4 text-gray-600">
                Bizi arayın, size en uygun mülkü birlikte bulalım.
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Location */}
            <div className="flex items-start gap-3 text-gray-600">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Hizmet Bölgeleri</p>
                <p className="mt-1 text-sm">
                  Çatalca, Silivri, Kocaeli, Tekirdağ, Kapaklı ve çevresi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
