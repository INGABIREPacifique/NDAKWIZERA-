'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [language, setLanguage]         = useState('en')
  const [mounted, setMounted]           = useState(false)
  const [isMenuOpen, setIsMenuOpen]     = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setLoading(false), 600)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0d1f3c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center shadow-lg animate-pulse mb-4">
            <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10">
              <path d="M18 4L22 14H33L24 20L27 31L18 25L9 31L12 20L3 14H14L18 4Z" fill="#2c1c05" opacity="0.3"/>
              <path d="M18 7L21 15.5H30L23 20.5L25.5 29L18 24.5L10.5 29L13 20.5L6 15.5H15L18 7Z" fill="#2c1c05"/>
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#f5efe0]">Ndakwizera</h2>
          <p className="text-[#7e8aab] text-sm mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  const translations = {
    en: {
      nav: { home: 'Home', signIn: 'Sign In', getStarted: 'Get Started' },
      hero: {
        title: 'Verify Assets & Liabilities with Confidence',
        subtitle: 'Ndakwizera provides legally-gated access to Rwanda\'s official records for asset and liability verification.',
        cta: 'Start Your Request',
        learnMore: 'Learn More'
      },
      services: {
        title: 'Our Services',
        subtitle: 'Verify assets and liabilities through Rwanda\'s trusted institutions',
        land:     { title: 'Land Verification',     description: 'Verify land ownership, boundaries, and legal status through NLA records.' },
        property: { title: 'Property Verification', description: 'Verify house, building, and property ownership records.' },
        vehicle:  { title: 'Vehicle Verification',  description: 'Verify vehicle ownership, registration, and loan status.' },
        business: { title: 'Business Verification', description: 'Verify business registration, directors, and financial standing.' },
        loans:    { title: 'Loan Verification',     description: 'Verify personal and business loan records from financial institutions.' }
      },
      how: {
        title: 'How It Works',
        step1: 'Create an account with your phone number',
        step2: 'Submit a verification request with legal reason',
        step3: 'Legal review and approval within 24 hours',
        step4: 'Institutions verify records',
        step5: 'Access report with OTP verification'
      },
      trust: {
        title: 'Why Trust Ndakwizera',
        stat1: '5 Institution Types',
        stat2: '24h Report Access',
        stat3: '0 Records Without Approval',
        stat4: '2× OTP Verification'
      },
      footer: { rights: 'All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Service' }
    },
    rw: {
      nav: { home: 'Akaruho', signIn: 'Injira', getStarted: 'Tangira' },
      hero: {
        title: 'Genzura Imitungo n\'Imipaka by\'Uwizera',
        subtitle: 'Ndakwizera itanga uburyo bwemewe n\'amategeko bwo kugera ku makuru y\'u Rwanda yo kugenzura imitungo n\'imipaka.',
        cta: 'Tangira Gusaba',
        learnMore: 'Menya Byinshi'
      },
      services: {
        title: 'Serivisi Zacu',
        subtitle: 'Genzura imitungo n\'imipaka ukoresheje inzego z\'u Rwanda zizera',
        land:     { title: 'Genzura Ubutaka',    description: 'Genzura uburenganzira ku butaka, imipaka, n\'amakuru yemewe binyuze mu NLA.' },
        property: { title: 'Genzura Inyubako',   description: 'Genzura uburenganzira ku nzu, inyubako, n\'ibindi mitungo.' },
        vehicle:  { title: 'Genzura Imodoka',    description: 'Genzura uburenganzira, kwiyandikisha, n\'amakuru y\'inguzanyo z\'imodoka.' },
        business: { title: 'Genzura Ibigo',      description: 'Genzura kwiyandikisha, abayobora, n\'amakuru y\'imari y\'ibigo.' },
        loans:    { title: 'Genzura Inguzanyo',  description: 'Genzura amakuru y\'inguzanyo zawe n\'iz\'ibigo binyuze mu bigo by\'imari.' }
      },
      how: {
        title: 'Uko Bikora',
        step1: 'Fungura konti ukoresheje nimero ya telefoni',
        step2: 'Tangira gusaba impamvu y\'amategeko',
        step3: 'Isuzuma ry\'amategeko mu masaha 24',
        step4: 'Inzego zemeza amakuru',
        step5: 'Bona raporo ukoresheje OTP'
      },
      trust: {
        title: 'Kuki Wizera Ndakwizera',
        stat1: '5 Ubwoko bw\'Inzego',
        stat2: 'Amasaha 24 Amakuru',
        stat3: '0 Amakuru Nta Kwemezwa',
        stat4: '2× OTP Kwemeza'
      },
      footer: { rights: 'Uburenganzira bwose burakomejwe.', privacy: 'Amahame y\'Ibanga', terms: 'Amategeko ya Serivisi' }
    },
    fr: {
      nav: { home: 'Accueil', signIn: 'Se connecter', getStarted: 'Commencer' },
      hero: {
        title: 'Vérifiez les Actifs et les Passifs en Toute Confiance',
        subtitle: 'Ndakwizera fournit un accès légalement contrôlé aux archives officielles du Rwanda.',
        cta: 'Commencer Votre Demande',
        learnMore: 'En Savoir Plus'
      },
      services: {
        title: 'Nos Services',
        subtitle: 'Vérifiez les actifs et les passifs via les institutions de confiance du Rwanda',
        land:     { title: 'Vérification Foncière',    description: 'Vérifiez la propriété foncière via les archives de la NLA.' },
        property: { title: 'Vérification Immobilière', description: 'Vérifiez la propriété des maisons et bâtiments.' },
        vehicle:  { title: 'Vérification Véhicule',    description: 'Vérifiez la propriété et le statut des prêts véhicules.' },
        business: { title: 'Vérification d\'Entreprise', description: 'Vérifiez l\'enregistrement et la situation financière.' },
        loans:    { title: 'Vérification de Prêt',     description: 'Vérifiez les dossiers de prêts auprès des institutions.' }
      },
      how: {
        title: 'Comment Ça Fonctionne',
        step1: 'Créez un compte avec votre numéro de téléphone',
        step2: 'Soumettez votre demande avec raison légale',
        step3: 'Examen et approbation légale sous 24 heures',
        step4: 'Les institutions vérifient les dossiers',
        step5: 'Accédez au rapport avec vérification OTP'
      },
      trust: {
        title: 'Pourquoi Faire Confiance à Ndakwizera',
        stat1: '5 Types d\'Institutions',
        stat2: '24h Accès au Rapport',
        stat3: '0 Dossiers Sans Approbation',
        stat4: '2× Vérification OTP'
      },
      footer: { rights: 'Tous droits réservés.', privacy: 'Politique de Confidentialité', terms: 'Conditions d\'Utilisation' }
    },
    sw: {
      nav: { home: 'Nyumbani', signIn: 'Ingia', getStarted: 'Anza' },
      hero: {
        title: 'Thibitisha Mali na Madeni kwa Ujasiri',
        subtitle: 'Ndakwizera inatoa ufikiaji wa kisheria wa rekodi rasmi za Rwanda za uthibitishaji.',
        cta: 'Anza Ombi Lako',
        learnMore: 'Jifunze Zaidi'
      },
      services: {
        title: 'Huduma Zetu',
        subtitle: 'Thibitisha mali na madeni kupitia taasisi zinazoaminika za Rwanda',
        land:     { title: 'Uthibitishaji wa Ardhi',    description: 'Thibitisha umiliki wa ardhi kupitia rekodi za NLA.' },
        property: { title: 'Uthibitishaji wa Mali',     description: 'Thibitisha umiliki wa nyumba na majengo.' },
        vehicle:  { title: 'Uthibitishaji wa Gari',     description: 'Thibitisha umiliki na hali ya mkopo wa gari.' },
        business: { title: 'Uthibitishaji wa Biashara', description: 'Thibitisha usajili na hali ya kifedha ya biashara.' },
        loans:    { title: 'Uthibitishaji wa Mikopo',   description: 'Thibitisha rekodi za mikopo kutoka taasisi za fedha.' }
      },
      how: {
        title: 'Jinsi Inavyofanya Kazi',
        step1: 'Fungua akaunti kwa nambari ya simu',
        step2: 'Wasilisha ombi kwa sababu ya kisheria',
        step3: 'Ukaguzi na idhini ya kisheria ndani ya saa 24',
        step4: 'Taasisi zinathibitisha rekodi',
        step5: 'Fikia ripoti kwa uthibitishaji wa OTP'
      },
      trust: {
        title: 'Kwa Nini Kuamini Ndakwizera',
        stat1: 'Aina 5 za Taasisi',
        stat2: 'Ufikiaji wa Ripoti ya Saa 24',
        stat3: 'Rekodi 0 Bila Idhini',
        stat4: '2× Uthibitishaji wa OTP'
      },
      footer: { rights: 'Haki zote zimehifadhiwa.', privacy: 'Sera ya Faragha', terms: 'Masharti ya Huduma' }
    },
    ar: {
      nav: { home: 'الرئيسية', signIn: 'تسجيل الدخول', getStarted: 'ابدأ' },
      hero: {
        title: 'تحقق من الأصول والخصوم بثقة',
        subtitle: 'توفر Ndakwizera وصولاً قانونياً إلى السجلات الرسمية لرواندا للتحقق.',
        cta: 'ابدأ طلبك',
        learnMore: 'اعرف المزيد'
      },
      services: {
        title: 'خدماتنا',
        subtitle: 'تحقق من الأصول والخصوم عبر مؤسسات رواندا الموثوقة',
        land:     { title: 'التحقق من الأراضي',   description: 'تحقق من ملكية الأراضي من خلال سجلات NLA.' },
        property: { title: 'التحقق من الممتلكات', description: 'تحقق من سجلات ملكية المنازل والمباني.' },
        vehicle:  { title: 'التحقق من المركبات',  description: 'تحقق من ملكية المركبة وحالة القرض.' },
        business: { title: 'التحقق من الأعمال',   description: 'تحقق من تسجيل الأعمال والوضع المالي.' },
        loans:    { title: 'التحقق من القروض',    description: 'تحقق من سجلات القروض من المؤسسات المالية.' }
      },
      how: {
        title: 'كيف يعمل',
        step1: 'أنشئ حساباً برقم هاتفك',
        step2: 'قدم طلبك مع سبب قانوني',
        step3: 'المراجعة والموافقة القانونية خلال 24 ساعة',
        step4: 'التحقق من السجلات من قبل المؤسسات',
        step5: 'الوصول إلى التقرير بتحقق OTP'
      },
      trust: {
        title: 'لماذا تثق في Ndakwizera',
        stat1: '5 أنواع من المؤسسات',
        stat2: 'الوصول إلى التقرير لمدة 24 ساعة',
        stat3: '0 سجلات بدون موافقة',
        stat4: '2× التحقق بواسطة OTP'
      },
      footer: { rights: 'جميع الحقوق محفوظة.', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة' }
    },
    de: {
      nav: { home: 'Startseite', signIn: 'Anmelden', getStarted: 'Loslegen' },
      hero: {
        title: 'Überprüfen Sie Vermögenswerte und Verbindlichkeiten mit Vertrauen',
        subtitle: 'Ndakwizera bietet legalen Zugang zu Rwandas offiziellen Aufzeichnungen zur Überprüfung.',
        cta: 'Starten Sie Ihre Anfrage',
        learnMore: 'Mehr Erfahren'
      },
      services: {
        title: 'Unsere Dienstleistungen',
        subtitle: 'Überprüfen Sie Vermögenswerte über Rwandas vertrauenswürdige Institutionen',
        land:     { title: 'Landverifizierung',        description: 'Überprüfen Sie Landbesitz durch NLA-Aufzeichnungen.' },
        property: { title: 'Immobilienverifizierung',  description: 'Überprüfen Sie Haus- und Gebäudebesitzaufzeichnungen.' },
        vehicle:  { title: 'Fahrzeugverifizierung',    description: 'Überprüfen Sie Fahrzeugbesitz und Kreditstatus.' },
        business: { title: 'Geschäftsverifizierung',   description: 'Überprüfen Sie Geschäftsregistrierung und finanzielle Situation.' },
        loans:    { title: 'Kreditverifizierung',      description: 'Überprüfen Sie Kreditaufzeichnungen von Finanzinstituten.' }
      },
      how: {
        title: 'Wie Es Funktioniert',
        step1: 'Erstellen Sie ein Konto mit Ihrer Telefonnummer',
        step2: 'Reichen Sie Ihre Anfrage mit rechtlichem Grund ein',
        step3: 'Rechtliche Prüfung und Genehmigung in 24 Stunden',
        step4: 'Institutionen überprüfen Aufzeichnungen',
        step5: 'Zugriff auf Bericht mit OTP-Verifizierung'
      },
      trust: {
        title: 'Warum Ndakwizera Vertrauen',
        stat1: '5 Institutionstypen',
        stat2: '24h Berichtszugriff',
        stat3: '0 Aufzeichnungen Ohne Genehmigung',
        stat4: '2× OTP-Verifizierung'
      },
      footer: { rights: 'Alle Rechte vorbehalten.', privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' }
    }
  }

  const t = translations[language] || translations.en

  const services = [
    {
      slug: 'land',
      title: t.services.land.title,
      description: t.services.land.description,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18M5 20V10l7-6 7 6v10M9 20v-6h6v6" />
        </svg>
      )
    },
    {
      slug: 'property',
      title: t.services.property.title,
      description: t.services.property.description,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5M5 10v10h14V10M9 20v-6h6v6" />
        </svg>
      )
    },
    {
      slug: 'vehicle',
      title: t.services.vehicle.title,
      description: t.services.vehicle.description,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 012-1.5h10A2 2 0 0119 8l2 5M3 13v5a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-5M3 13h18M7 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm13 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    },
    {
      slug: 'business',
      title: t.services.business.title,
      description: t.services.business.description,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a1 1 0 011-1h6a1 1 0 011 1v14M16 21V11a1 1 0 011-1h3a1 1 0 011 1v10M9 9h0M9 13h0M9 17h0" />
        </svg>
      )
    },
    {
      slug: 'loans',
      title: t.services.loans.title,
      description: t.services.loans.description,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      )
    }
  ]

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'rw', flag: '🇷🇼', name: 'Kinyarwanda' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'sw', flag: '🇹🇿', name: 'Kiswahili' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                <path d="M18 4L22 14H33L24 20L27 31L18 25L9 31L12 20L3 14H14L18 4Z" fill="#2c1c05" opacity="0.3"/>
                <path d="M18 7L21 15.5H30L23 20.5L25.5 29L18 24.5L10.5 29L13 20.5L6 15.5H15L18 7Z" fill="#2c1c05"/>
              </svg>
            </div>
            <span className="text-2xl font-bold font-serif text-[#0d1f3c]">
              Ndak<span className="text-[#c8963c]">w</span>izera
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-[#374151] hover:text-[#c8963c] transition-colors font-medium">{t.nav.home}</Link>
            <a href="#services" className="text-sm text-[#374151] hover:text-[#c8963c] transition-colors font-medium">Services</a>
            <a href="#how" className="text-sm text-[#374151] hover:text-[#c8963c] transition-colors font-medium">How It Works</a>
            <a href="#trust" className="text-sm text-[#374151] hover:text-[#c8963c] transition-colors font-medium">Why Trust Us</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#374151] border border-[#e5e7eb] px-3 py-1.5 rounded-full hover:border-[#c8963c] hover:text-[#c8963c] transition-all">
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <span className="text-[#9ca3af]">▾</span>
              </button>
              {showLangDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl py-2 min-w-[180px] shadow-2xl max-h-[300px] overflow-y-auto z-50">
                  {languages.map(lang => (
                    <button key={lang.code}
                      onClick={() => { setLanguage(lang.code); setShowLangDropdown(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#fdf6ea] transition-colors flex items-center gap-2 ${language === lang.code ? 'text-[#c8963c]' : 'text-[#374151]'}`}>
                      <span>{lang.flag}</span> {lang.name}
                      {language === lang.code && <span className="ml-auto text-[#c8963c]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In → real /login page */}
            <Link href="/login"
              className="hidden md:block text-sm text-[#374151] hover:text-[#c8963c] transition-colors px-3 py-1.5 font-medium">
              {t.nav.signIn}
            </Link>

            {/* Get Started → real /signup page */}
            <Link href="/signup"
              className="bg-[#c8963c] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#a3742a] transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(200,150,60,0.25)]">
              {t.nav.getStarted}
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#0d1f3c] p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#e5e7eb] bg-white rounded-lg p-4 flex flex-col gap-3">
            <Link href="/" className="text-sm text-[#374151] hover:text-[#c8963c]" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
            <a href="#services" className="text-sm text-[#374151] hover:text-[#c8963c]" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#how" className="text-sm text-[#374151] hover:text-[#c8963c]" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#trust" className="text-sm text-[#374151] hover:text-[#c8963c]" onClick={() => setIsMenuOpen(false)}>Why Trust Us</a>
            <Link href="/login" className="text-sm text-[#374151] hover:text-[#c8963c]" onClick={() => setIsMenuOpen(false)}>{t.nav.signIn}</Link>
            <Link href="/signup" className="bg-[#c8963c] text-white text-sm font-semibold px-5 py-2 rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>{t.nav.getStarted}</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1f3c]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(200,150,60,0.15),transparent_70%),radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(46,107,79,0.08),transparent_60%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(200,150,60,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,150,60,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%,black,transparent)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="mb-8 inline-block">
            <div className="w-28 h-28 rounded-full border-2 border-[#c8963c]/35 flex items-center justify-center relative">
              <div className="absolute inset-[-10px] rounded-full border border-[#c8963c]/15"></div>
              <div className="absolute inset-[-20px] rounded-full border border-dashed border-[#c8963c]/8"></div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center shadow-[0_4px_20px_rgba(200,150,60,0.4)]">
                <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                  <path d="M18 4L22 14H33L24 20L27 31L18 25L9 31L12 20L3 14H14L18 4Z" fill="#2c1c05" opacity="0.3"/>
                  <path d="M18 7L21 15.5H30L23 20.5L25.5 29L18 24.5L10.5 29L13 20.5L6 15.5H15L18 7Z" fill="#2c1c05"/>
                </svg>
              </div>
            </div>
          </div>
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#c8963c] mb-4">
            Verified Asset & Liability Transparency Platform
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-[#f5efe0] leading-[1.05] mb-4">
            {t.hero.title}
          </h1>
          <p className="text-base md:text-lg text-[#d4cfc5] max-w-2xl mx-auto leading-relaxed mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup"
              className="bg-[#c8963c] text-[#2c1c05] font-semibold px-8 py-3 rounded-xl hover:bg-[#e3b96a] transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(200,150,60,0.35)]">
              {t.hero.cta}
            </Link>
            <a href="#services"
              className="bg-transparent text-[#f5efe0] font-semibold px-8 py-3 rounded-xl border border-white/20 hover:border-[#c8963c] hover:text-[#c8963c] transition-all hover:-translate-y-1">
              {t.hero.learnMore}
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 justify-center flex-wrap text-xs text-[#7e8aab]">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2e6b4f]"></span> Legal approval required</span>
            <span>·</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2e6b4f]"></span> OTP-verified access</span>
            <span>·</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2e6b4f]"></span> 24-hour report access</span>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#a3742a] mb-4 text-center">Our Services</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0d1f3c] text-center mb-4">{t.services.title}</h2>
          <p className="text-[#4b5563] text-center max-w-2xl mx-auto mb-12">{t.services.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Link key={i} href={`/services/${service.slug}`}
                className="bg-white rounded-2xl p-6 border border-[#e5e7eb] hover:border-[#c8963c]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-[#fdf6ea] text-[#a3742a] flex items-center justify-center mb-4 group-hover:bg-[#c8963c] group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0d1f3c] mb-2">{service.title}</h3>
                <p className="text-sm text-[#4b5563] leading-relaxed">{service.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-[#a3742a] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Learn More
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 px-4 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#a3742a] mb-4 text-center">How It Works</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0d1f3c] text-center mb-12">{t.how.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(step => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg mb-4">
                  {step}
                </div>
                <p className="text-sm text-[#374151]">
                  {step === 1 && t.how.step1}
                  {step === 2 && t.how.step2}
                  {step === 3 && t.how.step3}
                  {step === 4 && t.how.step4}
                  {step === 5 && t.how.step5}
                </p>
                {step < 5 && <div className="hidden md:block text-[#c8963c] text-2xl mt-2">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#a3742a] mb-4 text-center">Why Trust Us</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0d1f3c] text-center mb-12">{t.trust.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '5',   label: t.trust.stat1 },
              { val: '24h', label: t.trust.stat2 },
              { val: '0',   label: t.trust.stat3 },
              { val: '2×',  label: t.trust.stat4 },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#e5e7eb] hover:border-[#c8963c]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
                <div className="font-serif text-3xl font-bold text-[#c8963c] mb-2">{s.val}</div>
                <p className="text-sm text-[#4b5563]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center relative overflow-hidden bg-[#f7f8fa]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(200,150,60,0.06),transparent_70%)]" />
        <div className="max-w-2xl mx-auto relative">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center shadow-[0_0_0_12px_rgba(200,150,60,0.08)]">
            <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
              <path d="M14 3L17 11H26L19 16L21.5 24L14 19.5L6.5 24L9 16L2 11H11L14 3Z" fill="#2c1c05"/>
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-[#0d1f3c] mb-4">Ready to know the truth?</h2>
          <p className="text-[#4b5563] mb-8">Submit your first request in minutes. Every step is legally supervised.</p>
          <Link href="/signup"
            className="bg-[#c8963c] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#a3742a] transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(200,150,60,0.25)] inline-block">
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d1f3c] border-t border-[#c8963c]/20 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e3b768] to-[#a3742a] flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5">
                <path d="M18 4L22 14H33L24 20L27 31L18 25L9 31L12 20L3 14H14L18 4Z" fill="#2c1c05" opacity="0.3"/>
                <path d="M18 7L21 15.5H30L23 20.5L25.5 29L18 24.5L10.5 29L13 20.5L6 15.5H15L18 7Z" fill="#2c1c05"/>
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-[#f5efe0]">
              Ndak<span className="text-[#c8963c]">w</span>izera
            </span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/login" className="text-xs text-[#7e8aab] hover:text-[#c8963c] transition-colors">{t.nav.signIn}</Link>
            <Link href="/signup" className="text-xs text-[#7e8aab] hover:text-[#c8963c] transition-colors">{t.nav.getStarted}</Link>
            <Link href="#services" className="text-xs text-[#7e8aab] hover:text-[#c8963c] transition-colors">Services</Link>
          </div>
          <div className="text-xs text-[#4a5270]">© 2026 Ndakwizera · {t.footer.rights}</div>
        </div>
      </footer>
    </div>
  )
}
