import type { Metadata } from 'next'
import { Article, Callouts, Figure, Lede } from '@/components/blog/article'
import { LineChart } from '@/components/charts'
import { getConcentrationSince2022 } from '@/lib/mock/blog-recent'
import { palette } from '@/lib/palette'

export const metadata: Metadata = {
  title: 'Validator Parity, four years later',
  description:
    'A follow-up to our 2022 analysis of Osmosis voting power: how the Nakamoto coefficient and top-10 share have changed since.',
}

export default function ParityFollowUpPost() {
  const { series, first, last } = getConcentrationSince2022()

  return (
    <Article slug="validator_parity_four_years_later">
      <Lede>
        In February 2022 we wrote that Osmosis voting power was “highly skewed”. Four years and a lot of governance
        debate later, we went back to see whether anything changed.
      </Lede>
      <p>
        If you missed it, the <a href="/blog/validator_parity">original Validator Parity post</a> used skew and kurtosis
        to show how far the validator set was from an even spread. This time we track two numbers that are easier to
        reason about.
      </p>
      <ul>
        <li>
          <strong>Nakamoto coefficient:</strong> the smallest number of validators that together hold more than a third
          of voting power. That is enough to block a proposal or halt the chain. Higher is better.
        </li>
        <li>
          <strong>Top-10 share:</strong> the percentage of voting power held by the ten largest validators. Lower is
          better.
        </li>
      </ul>

      <h2>The trend</h2>
      <Figure title="Nakamoto coefficient by quarter" caption="Validators needed to reach ⅓ of voting power, Q1 2022 – Q2 2026." wide>
        <LineChart
          data={series}
          index="quarter"
          rawX
          height={260}
          series={[{ key: 'nakamoto', name: 'Nakamoto coefficient', color: palette.sun }]}
        />
      </Figure>
      <Figure title="Top-10 validator share" caption="Share of total voting power held by the ten largest validators." wide>
        <LineChart
          data={series}
          index="quarter"
          rawX
          height={260}
          format="pct0"
          series={[{ key: 'top10', name: 'Top-10 share', color: palette.lapis }]}
        />
      </Figure>
      <Callouts
        items={[
          { label: 'Nakamoto coefficient', value: `${first.nakamoto} → ${last.nakamoto}`, note: `${first.quarter} to ${last.quarter}` },
          { label: 'Top-10 share', value: `${first.top10}% → ${last.top10}%`, note: `${first.quarter} to ${last.quarter}` },
        ]}
      />

      <h2>What changed</h2>
      <p>
        No single fix did this. A few forces worked together. Delegation programs started rewarding smaller,
        well-performing validators. Wallets started showing commission and governance participation next to the stake
        button, and some stopped sorting by voting power by default. And community dashboards, ours included, made it
        much easier to see who actually shows up to vote.
      </p>
      <p>
        That last point is close to our hearts. When we started publishing{' '}
        <a href="/validator_voting_history/osmosis">validator voting history</a>, the goal was to give delegators a
        reason to look past the top of the list. We cannot prove cause and effect, but the timing is encouraging.
      </p>

      <h2>What has not</h2>
      <p>
        The distribution is still far from even. The largest validators remain several times bigger than the median,
        and new delegators still mostly pick from the first screen of their wallet. Decentralization is a habit, not a
        milestone.
      </p>
      <p>
        We will keep re-running these numbers every quarter. If you would like the same analysis for your own chain,{' '}
        <a href="/contact_us">reach out</a>.
      </p>
    </Article>
  )
}
