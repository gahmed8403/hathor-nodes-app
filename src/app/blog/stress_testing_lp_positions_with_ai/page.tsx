import type { Metadata } from 'next'
import { Article, Callouts, DataList, Figure, Formula, Lede } from '@/components/blog/article'
import { BarChart } from '@/components/charts'
import { getLpStressTest } from '@/lib/mock/blog-recent'
import { palette } from '@/lib/palette'

export const metadata: Metadata = {
  title: 'Stress-testing an LP position with AI, step by step',
  description:
    'How our AI-assisted risk workflow stress-tests a liquidity position: pulling on-chain data, running simulations, and explaining the result in plain language.',
}

export default function StressTestPost() {
  const { scenarios, histogram, p5, median, lossProbability } = getLpStressTest()
  const ilAt = (shock: string) => Math.abs(scenarios.find((s) => s.shock === shock)?.il ?? 0).toFixed(1)

  return (
    <Article slug="stress_testing_lp_positions_with_ai">
      <Lede>
        “What happens to our pool position if ATOM drops 40%?” is one of the most common questions we get from
        treasuries. Answering it properly used to take an analyst most of a day. Here is how we do it now.
      </Lede>
      <p>
        This post walks through the AI-assisted risk workflow we run for clients, using a demo ATOM/OSMO liquidity
        position. The AI does the legwork: fetching data, running the numbers and drafting the explanation. An analyst
        reviews every step before anything goes out. Neither half works well without the other.
      </p>

      <h2>Step 1: get the real numbers</h2>
      <p>
        The single biggest improvement we have made to AI analysis is refusing to let the model guess. Before it says
        anything, the assistant calls a small set of tools we built that read directly from chain:
      </p>
      <DataList
        rows={[
          { label: 'query_rpc', value: 'Pool reserves, swap fee, 30-day history' },
          { label: 'fetch_prices', value: 'Hourly ATOM and OSMO prices' },
          { label: 'get_position', value: 'The client’s LP shares (read-only)' },
          { label: 'run_stress_test', value: 'Scenario grid + Monte Carlo paths' },
        ]}
      />
      <p>
        Every number in the final report can be traced back to one of these calls. If a tool fails, the assistant says
        so instead of filling the gap. That one rule removes most of the risk of using AI on financial data. We cover
        it in more depth in{' '}
        <a href="/blog/grounding_ai_in_chain_data">Grounding AI in chain data</a>.
      </p>

      <h2>Step 2: the scenario grid</h2>
      <p>
        Start simple: shock one asset by a fixed amount and measure the impermanent loss compared to just holding. For
        a 50/50 pool the formula is short enough to check by hand, which makes it a good sanity check on the
        simulation code.
      </p>
      <Formula label="Impermanent loss, 50/50 pool">IL(r) = 2·√r ÷ (1 + r) − 1, where r = new price ÷ old price</Formula>
      <Figure
        title="Impermanent loss by price shock"
        caption="Loss vs holding for each ATOM move, before and after 90 days of estimated swap fees."
        wide
      >
        <BarChart
          data={scenarios}
          index="shock"
          height={280}
          format="pct"
          series={[
            { key: 'il', name: 'Impermanent loss', color: palette.carnelian },
            { key: 'feesOffset', name: 'After 90d of fees', color: palette.turquoise },
          ]}
        />
      </Figure>
      <p>
        Two things stand out. First, IL is not linear and not symmetric: a 40% drop costs about {ilAt('-40%')}%, a 60%
        drop costs {ilAt('-60%')}%, while a 40% rise costs only {ilAt('+40%')}%. Second, three months of fees cover the
        small moves entirely. For this pool, what matters is the tail, not the typical day.
      </p>

      <h2>Step 3: simulate the tails</h2>
      <p>
        A grid shows you a few chosen points. A simulation shows you how likely each outcome is. We run 10,000 price
        paths over 90 days, calibrated to the pair’s realized volatility, and record the position’s return against
        holding.
      </p>
      <Figure title="Distribution of 90-day outcomes" caption="10,000 simulated paths · return vs holding, fees included." wide>
        <BarChart
          data={histogram}
          index="bucket"
          height={260}
          format="number"
          series={[{ key: 'paths', name: 'Paths', color: palette.sun }]}
        />
      </Figure>
      <Callouts
        items={[
          { label: 'Median outcome', value: `${median > 0 ? '+' : ''}${median}%`, note: 'vs holding, after fees' },
          { label: 'Bad case (5th percentile)', value: `${p5}%`, note: `${lossProbability}% of paths underperform holding` },
        ]}
      />

      <h2>Step 4: explain it like a human would</h2>
      <p>
        Numbers are not a decision. The last step is the one AI is genuinely great at: turning a table into a clear
        recommendation that a treasury committee can act on. Our template forces three things into every summary:
        what happens in the bad case, how likely that is, and what you could do about it.
      </p>
      <p>
        For this position the draft read: <em>“The position survives a 40% ATOM shock, but you end up heavier in ATOM.
        Fees cover typical volatility. If a drawdown of more than 5% is unacceptable, consider hedging a quarter of the
        ATOM exposure and re-running this check weekly.”</em>
      </p>

      <h2>Step 5: a person signs off</h2>
      <p>
        An analyst re-derives the headline numbers, checks the tool logs, and edits the wording. On this report that
        took 15 minutes instead of a day. That is the real gain: not replacing judgment, but giving the people with
        judgment more time to use it.
      </p>
      <p>
        If you would like this kind of review for your own positions, <a href="/contact_us">get in touch</a>.
      </p>
    </Article>
  )
}
