import type { Metadata } from 'next'
import { Shield, Clock, Briefcase, Users, MapPin, TreePine } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda | Emlak Serkan',
  description:
    'Serkan Güner ve Emlak Serkan hakkında. Çatalca, Silivri, Kocaeli, Tekirdağ bölgelerinde güvenilir emlak danışmanlığı.',
}

const values = [
  {
    icon: Shield,
    title: 'Güvenilir',
    description:
      'Müşterilerimize her zaman şeffaf ve dürüst hizmet sunuyoruz.',
  },
  {
    icon: Clock,
    title: 'Deneyimli',
    description:
      'Uzun yıllara dayanan sektör tecrübesiyle yanınızdayız.',
  },
  {
    icon: Briefcase,
    title: 'Geniş Portföy',
    description:
      'Arsa, ev, villa ve tarla gibi geniş bir mülk yelpazesi sunuyoruz.',
  },
  {
    icon: Users,
    title: 'Müşteri Odaklı',
    description:
      'İhtiyaçlarınızı dinliyor, size en uygun çözümü buluyoruz.',
  },
]

const serviceRegions = [
  'Çatalca',
  'Silivri',
  'Kocaeli',
  'Tekirdağ',
  'Kapaklı',
]

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
          <TreePine className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Hakkımızda
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary-500" />
      </div>

      {/* About content */}
      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
        <p>
          <strong className="text-primary-700">Emlak Serkan</strong>, Serkan
          Güner tarafından kurulan ve uzun yıllardır gayrimenkul sektöründe
          hizmet veren güvenilir bir emlak danışmanlık firmasıdır. Çatalca
          Kestanelik&apos;te yaşayan Serkan Güner, bölgenin dinamiklerini ve
          potansiyelini yakından tanıyan bir isim olarak müşterilerine en doğru
          yatırım fırsatlarını sunmaktadır.
        </p>
        <p>
          Özellikle arsa ve arazi satışı konusunda uzmanlaşmış olan firmamız,
          bunun yanı sıra ev, villa ve tarla alım-satım işlemlerinde de
          profesyonel danışmanlık hizmeti vermektedir. Her mülk için detaylı
          araştırma yaparak müşterilerimizin beklentilerine en uygun seçenekleri
          bir araya getiriyoruz.
        </p>
        <p>
          Çatalca, Silivri, Kocaeli, Tekirdağ ve Kapaklı gibi gelişen
          bölgelerde geniş bir portföye sahip olan Emlak Serkan, yatırım
          yapmak isteyen herkese rehberlik etmektedir. Müşteri memnuniyetini
          her zaman ön planda tutarak, şeffaf ve güvenilir bir alışveriş
          deneyimi sunmayı ilke ediniyoruz.
        </p>
      </div>

      {/* Service regions */}
      <div className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Hizmet Bölgelerimiz
            </h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {serviceRegions.map((region) => (
              <span
                key={region}
                className="rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-800"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Neden Biz?
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-primary-500" />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
