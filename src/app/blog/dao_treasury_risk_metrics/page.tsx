import type { Metadata } from 'next'
import { Article, Figure, Formula, Lede } from '@/components/blog/article'
import { DonutChart, LineChart } from '@/components/charts'
import { getTreasuryRisk } from '@/lib/mock/blog-recent'
import { palette } from '@/lib/palette'

export const metadata: Metadata = {
  title: 'Five treasury risk metrics every DAO should track',
  description:
    'The five numbers we check first in every DAO treasury review: concentration, runway under stress, liquidity depth, counterparty exposure and correlation.',
}

export default function TreasuryRiskPost() {
  const { composition, runway } = getTreasuryRisk()

  return (
    <Article slug="dao_treasury_risk_metrics">
      <Lede>
        Most DAO treasuries look healthy on a good day. The question is what they look like on a bad one. These are the
        five numbers we check first in every treasury review.
      </Lede>
      <p>
        The examples below use a composite demo treasury, but the pattern is one we see over and over: a large balance,
        mostly in the DAO’s own token, with a runway calculated at today’s prices.
      </p>

      <h2>1. Concentration in the native token</h2>
      <p>
        If most of your treasury is your own token, your runway falls exactly when you need it most. A market downturn,
        a governance crisis or a security incident all hit the token price and the treasury at the same time.
      </p>
      <Figure title="Demo treasury composition" caption="Share of treasury value by asset.">
        <DonutChart data={composition} format="pct0" centerValue="64%" centerLabel="Native token" />
      </Figure>

      <h2>2. Runway under stress, not at spot</h2>
      <p>
        Runway is usually quoted as treasury value divided by monthly spend. That number assumes prices never move.
        Re-run it with a drawdown and the picture changes fast.
      </p>
      <Formula label="Stressed runway">runway = (stable assets + volatile assets × (1 − drawdown)) ÷ monthly spend</Formula>
      <Figure
        title="Runway under three scenarios"
        caption="Treasury value as % of today, with constant spend. Drawdowns phase in over three months."
        wide
      >
        <LineChart
          data={runway}
          index="month"
          rawX
          height={280}
          format="pct0"
          series={[
            { key: 'base', name: 'Prices flat', color: palette.lapis },
            { key: 'drawdown', name: '−45% native token', color: palette.carnelian },
            { key: 'diversified', name: '−45%, after diversifying', color: palette.turquoise },
          ]}
        />
      </Figure>
      <p>
        In this demo, a 45% drop in the native token turns a three-year runway into about twenty months. Moving a
        portion into stablecoins ahead of time recovers most of that.
      </p>

      <h2>3. Liquidity depth</h2>
      <p>
        Could you actually sell what you hold? We measure the price impact of selling 1%, 5% and 10% of each position
        through available pools. A treasury that cannot exit without moving the market 20% is worth less than its
        balance suggests.
      </p>

      <h2>4. Counterparty and protocol exposure</h2>
      <p>
        Bridged assets, liquid-staking tokens, lending deposits and LP positions each carry the risk of another
        protocol. We list every dependency and ask: if this one failed, how much would we lose, and how fast would we
        know?
      </p>

      <h2>5. Correlation</h2>
      <p>
        Diversifying into five tokens that all move together is not diversifying. We compute the correlation of each
        holding with the native token and with the broader market over the last 90 days. The goal is to have some
        assets that hold up when everything else falls.
      </p>

      <h2>Make it automatic</h2>
      <p>
        None of these metrics are hard to calculate once. The hard part is keeping them current. We set up AI-assisted
        monitors that recompute them daily from on-chain data and send a short, plain-language note when something
        crosses a threshold, so your treasury committee hears about a problem before it becomes a crisis.
      </p>
      <p>
        Want a review of your own treasury? <a href="/contact_us">Book a consultation</a>.
      </p>
    </Article>
  )
}
