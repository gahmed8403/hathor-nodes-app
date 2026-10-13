import type { Metadata } from 'next'
import { Article, Figure, Formula, Lede } from '@/components/blog/article'
import { PreciseLineChart } from '@/components/blog/precise-line-chart'
import { getGamm573Series } from '@/lib/mock/blog'

export const metadata: Metadata = {
  title: 'Impermanent Loss & You',
  description:
    'Swap fees vs impermanent loss on the Osmosis BTSG/OSMO pool (GAMM-573): can fees alone make up for IL when you ignore incentives?',
}

const tableRows = [
  { block: '1,800,000', btsg: '0.822', osmo: '0.0735', pBtsg: '$0.483', pOsmo: '$5.40', gamm: '$0.000000794' },
  { block: '2,620,000', btsg: '0.977', osmo: '0.0636', pBtsg: '$0.420', pOsmo: '$6.46', gamm: '$0.000000821' },
]

// Chart colours (kept local: values exported from client modules aren't readable in server components)
const palette = {
  sun: '#e8b44c',
  lapis: '#7193ff',
  turquoise: '#3cc6b5',
  carnelian: '#f0705a',
  violet: '#a879ff',
}

export default function ImpermanentLossPage() {
  const series = getGamm573Series()

  return (
    <Article slug="impermanent_loss_and_you">
      <Lede>
        Osmosis Governance recently approved another set of external incentive matching for the BTSG pools. I wanted to
        analyze how these pools perform if you ignore incentives: simply swap fees accrued vs impermanent loss.
      </Lede>
      <p>
        When you put tokens in a pool, you&apos;re now investing in the GAMM itself. When people use the pool, the swap
        fees go to the GAMM holders, which increases the tokens represented by each GAMM.
      </p>
      <p>
        With impermanent loss, your GAMMs end up representing more of the token that underperforms in a pool — but does
        that mean you have less money than if you had just held both tokens? Not necessarily! In this example, if you
        had invested in the{' '}
        <a href="https://app.osmosis.zone/pool/573" target="_blank" rel="noreferrer">
          BTSG/OSMO
        </a>{' '}
        pool on October 31st (block 1,800,000 in the charts), your GAMMs would actually have gained 3.45% in value as of
        January 1st (block 2,620,000).
      </p>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-mist-500">
            <tr>
              {['Block', 'uBTSG', 'uOSMO', 'BTSG price', 'OSMO price', 'GAMM-573 value'].map((h, i) => (
                <th key={h} scope="col" className={`px-4 py-3 font-medium ${i ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono tabular-nums">
            {tableRows.map((r) => (
              <tr key={r.block}>
                <td className="px-4 py-3 text-mist-50">{r.block}</td>
                <td className="px-4 py-3 text-right">{r.btsg}</td>
                <td className="px-4 py-3 text-right">{r.osmo}</td>
                <td className="px-4 py-3 text-right">{r.pBtsg}</td>
                <td className="px-4 py-3 text-right">{r.pOsmo}</td>
                <td className="px-4 py-3 text-right text-sun-200">{r.gamm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>So the GAMM&apos;s performance is:</p>
      <Formula label="GAMM performance">
        ($0.000000821 − $0.000000794) / $0.000000794 ≈ <span className="text-turquoise-300">+3.45%</span>
      </Formula>
      <p>And the impermanent loss would be calculated as:</p>
      <Formula label="Impermanent loss">
        IL = (uBTSG<sub>start</sub> × P<sub>uBTSG, now</sub>) + (uOSMO<sub>start</sub> × P<sub>uOSMO, now</sub>) − GAMM
        <sub>now</sub>
      </Formula>
      <p>Which comes out to:</p>
      <Formula label="Plugging in">
        (0.822 × $0.420 / 10⁶ + 0.0735 × $6.46 / 10⁶ − $0.000000821) / $0.000000821 ≈{' '}
        <span className="text-turquoise-300">−0.12%</span>
      </Formula>
      <p>
        The division by a million converts the BTSG/OSMO price to a uBTSG/uOSMO price. Note that the % loss is negative —
        this means we don&apos;t have any losses, and instead actually have an <em>impermanent gain</em>, though in this
        case it&apos;s a relatively small amount.
      </p>
      <p>
        Again, note that this doesn&apos;t include external/internal incentives and the compounding of those incentives.
        That&apos;s because the incentives are temporary, and I wanted to compare the ROI of a pool to just holding the
        tokens. Hopefully SuperFluid Staking will come out and I can run these numbers again — assuming the OSMO portion
        is being staked — and compare that to just staking the individual tokens by themselves.
      </p>

      <h2>IL in action</h2>
      <p>
        We can expand this past our example case and view the IL of this pool in action by plotting the amount of
        Bitsong and OSMO represented by a GAMM:
      </p>
      <div className="grid gap-5 lg:-mx-20 lg:grid-cols-2">
        <Figure title="uBTSG in a GAMM-573" caption="Per GAMM share, by block height">
          <PreciseLineChart data={series} index="block" dataKey="btsg" name="uBTSG" color={palette.carnelian} digits={3} baseline={0.822} />
        </Figure>
        <Figure title="uOSMO in a GAMM-573" caption="Per GAMM share, by block height">
          <PreciseLineChart data={series} index="block" dataKey="osmo" name="uOSMO" color={palette.violet} digits={4} baseline={0.0735} />
        </Figure>
      </div>
      <p>Lastly, let&apos;s see how this IL impacts the price of the GAMM itself while the swap fees accrue:</p>
      <Figure title="USD value of GAMM-573" caption="Value of 1,000,000 GAMM shares, by block height · dashed line = starting value" wide>
        <PreciseLineChart data={series} index="block" dataKey="usd" name="USD / 1M GAMM" color={palette.sun} digits={3} prefix="$" height={280} baseline={0.794} />
      </Figure>
      <p>
        The two pool tokens have an inverted relationship, as expected due to IL. The USD chart follows a bit of its own
        pattern as it&apos;s focused on the USD value of the tokens more so than the amount of each in the pool.
        Eventually though, you can see the USD value of the GAMM overcomes IL and becomes more valuable than it started!
      </p>

      <h2>Takeaways</h2>
      <p>
        To summarize: when picking a pool to invest in, IL is definitely an important thing to consider. What people
        often fail to consider is the value of swap fees in balancing out IL. As we&apos;ve just demonstrated, swap fees
        can be fairly effective at matching or overcoming IL! The most important things to keep in mind when picking a
        pool are the APR incentives — internal and external — plus how bullish you are on the assets in the pool.
      </p>
    </Article>
  )
}
