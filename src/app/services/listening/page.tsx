import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listening Circle | MyndZeal'
}

const tiers = [
  {
    key: 'active-support',
    title: 'Active Listener Support',
    price: 99,
    duration: '45 minutes',
    service: 'Active Listener Support',
    description: 'At MYNDZEAL, we are always here to listen, support, and understand you. Our compassionate listeners are available 24*7 whenever you need a safe space to share your thoughts and feelings. You are never alone—we are here for you, every step of the way.',
    href: '/services/listening/book?tier=active'
  },
  {
    key: 'empathetic-listeners',
    title: 'Empathetic Listeners',
    price: 149,
    duration: '45 minutes',
    service: 'Empathetic Listeners',
    description: 'Empathy is at the heart of our service. Our empathetic listeners connect with you on a deeper level, offering understanding and compassion to help you navigate your emotions.',
    href: '/services/listening/book?tier=empathetic'
  },
  {
    key: 'effective-communicators',
    title: 'Effective Communicators',
    price: 199,
    duration: '45 minutes',
    service: 'Effective Communicators',
    description: 'Our effective communicators ensure that every interaction is meaningful and constructive. They help you articulate your thoughts and feelings while providing valuable feedback.',
    href: '/services/listening/book?tier=communicators'
  }
]

export default function ListeningCyclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FC] via-[#C8E8F5] to-[#8BA872]/20 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2D3319] mb-4 tracking-tight">Listening Circle</h1>
          <p className="text-[#4A5D3A] max-w-2xl mx-auto font-medium mb-2">Choose the depth of support that fits your current emotional need. Each tier can later transition into counselling if required.</p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <span className="text-green-700 font-semibold text-sm">🟢 Available 24*7 • Anonymous Support</span>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((t, idx) => (
            <div key={t.key} className="group relative rounded-2xl border border-[#D7D5C9] bg-[#EFEDE1]/90 backdrop-blur p-6 flex flex-col shadow-sm hover:shadow-lg hover:border-[#C8C6B8] transition overflow-hidden">
              <div
                className={
                  `pointer-events-none absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 blur-2xl transition-opacity duration-700 mix-blend-multiply animate-[pulseGlow_6s_ease-in-out_infinite] ` +
                  (idx===0 ? 'bg-gradient-to-br from-[#8BA872]/60 via-[#B7E3FF]/40 to-[#F0F7FC]/40'
                  : idx===1 ? 'bg-gradient-to-br from-[#B7E3FF]/60 via-[#8BA872]/40 to-[#F0F7FC]/40'
                  : 'bg-gradient-to-br from-[#8BA872]/55 via-[#F0F7FC]/40 to-[#C8E8F5]/50')
                }
              />
              <div
                className={
                  `absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-tr from-white/10 to-white/40 opacity-30 group-hover:opacity-60 animate-[spinSlow_18s_linear_infinite]`}
              />
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-[#2D3319] group-hover:text-[#587542] transition max-w-[70%] leading-snug">{t.title}</h2>
                <div className="text-right space-y-1">
                  <div className="text-xs font-semibold text-[#587542] bg-[#8BA872]/15 px-2 py-1 rounded-full inline-block">{t.duration}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2 rounded-lg bg-white/70 border border-[#D7D5C9]">
                  <p className="text-[10px] tracking-wide text-[#587542] font-medium mb-0.5">Price</p>
                  <p className="text-sm font-semibold text-[#2D3319]">₹{t.price}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/70 border border-[#D7D5C9]">
                  <p className="text-[10px] tracking-wide text-[#587542] font-medium mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-[#2D3319]">{t.duration} min</p>
                </div>
                <div className="p-2 rounded-lg bg-green-50 border border-green-200 col-span-2">
                  <p className="text-[10px] tracking-wide text-green-700 font-medium mb-0.5 text-center">Available 24*7 • Anonymous Support</p>
                </div>
              </div>
              <p className="text-sm text-[#4A5D3A] flex-1 mb-5 leading-relaxed">{t.description}</p>
              <Link href={t.href} className="inline-flex justify-center items-center text-sm font-semibold bg-[#8BA872] text-white rounded-xl py-2.5 px-4 hover:bg-[#76925b] shadow hover:shadow-md transition mt-auto">Select</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-static';
