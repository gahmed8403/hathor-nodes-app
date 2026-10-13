import { Bot, Check, FlaskConical, GraduationCap, Landmark, ShieldCheck, Workflow } from 'lucide-react'
import { Card } from '@/components/ui/primitives'
import { services, type Service } from '@/lib/services'

export const serviceIcons = {
  shield: ShieldCheck,
  bot: Bot,
  flask: FlaskConical,
  landmark: Landmark,
  workflow: Workflow,
  graduation: GraduationCap,
} satisfies Record<Service['icon'], unknown>

export function ServicesGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => {
        const Icon = serviceIcons[s.icon]
        return (
          <Card key={s.slug} id={s.slug} className="group flex scroll-mt-24 flex-col p-7 transition hover:border-sun-400/25">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-sun-400/30 bg-sun-400/10 text-sun-300 transition group-hover:bg-sun-400 group-hover:text-ink-950">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-6 text-xl font-semibold text-mist-50">{s.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-mist-400">{s.summary}</p>
            {detailed && (
              <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 text-sm">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-mist-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turquoise-300" />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )
      })}
    </div>
  )
}
