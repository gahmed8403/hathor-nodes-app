import type { Metadata } from 'next'
import { Article, DataList, Figure, Formula, Lede } from '@/components/blog/article'
import { AreaChart, LineChart } from '@/components/charts'
import { getOsmoValueSeries } from '@/lib/mock/blog'

export const metadata: Metadata = {
  title: 'Osmosis in Graphs: The value of an Osmo',
  description:
    'How the price of OSMO reflects the TVL of every token paired with it in Osmosis liquidity pools — with worked examples and what-if scenarios.',
}

// Chart colours (kept local: values exported from client modules aren't readable in server components)
const palette = {
  sun: '#e8b44c',
  lapis: '#7193ff',
  turquoise: '#3cc6b5',
  carnelian: '#f0705a',
  violet: '#a879ff',
}

export default function ValueOfAnOsmoPage() {
  const { price, pairedShare } = getOsmoValueSeries()

  return (
    <Article slug="value_of_an_osmo">
      <Lede>
        Every day, millions of dollars are traded in and out of Osmosis pools. From users compounding their LP rewards
        to traders exchanging tokens, every transaction slowly yet surely increases the TVL of Osmosis. When the TVL of
        Osmosis increases, the price of an OSMO tends to follow.
      </Lede>
      <p>In this post, we&apos;re going to take a deep dive into the pricing of an OSMO.</p>
      <p>
        Note that pricing and other data points are based on the epoch block for Sunday, February 13th. When referring to
        TVL, I&apos;m not including the value of the OSMO in the pools. This is because I hope to demonstrate how the
        value of an OSMO is simply a reflection of the value of all the tokens paired with it in Osmosis liquidity pools.
      </p>

      <h2>Pricing an OSMO</h2>
      <p>
        Since the majority of OSMO&apos;s liquidity is in Osmosis, the price of an OSMO can be defined by what you can
        swap it for. OSMO is the main trading pair of Osmosis, existing in 420 of the 639 current pools. This means the
        price of an OSMO can be roughly estimated as the TVL of each pool&apos;s non-OSMO assets divided by the total
        number of OSMO in those pools. A rough formula might be written as:
      </p>
      <Formula label="Price of an OSMO">
        P<sub>OSMO</sub> ≈ Σ<sub>pools</sub> TVL<sub>non-OSMO</sub> / Σ<sub>pools</sub> N<sub>OSMO</sub>
      </Formula>
      <p>
        Let&apos;s use a simple example. Imagine there were two pools on Osmosis, an ATOM/OSMO pool and an AKT/OSMO
        pool. The makeup of these pools is:
      </p>
      <DataList
        rows={[
          { label: 'Pool 1', value: '4 ATOM / 24 OSMO' },
          { label: 'Pool 2', value: '10 AKT / 5 OSMO' },
        ]}
      />
      <p>
        Now let&apos;s say the price of an ATOM is $24 and the price of an AKT is $2. We have a total of 29 (24 + 5) OSMO
        bonded in the pools. The value of the non-OSMO tokens is equal to $116:
      </p>
      <Formula label="TVL of non-OSMO assets paired with OSMO">
        TVL<sub>non-OSMO</sub> = 4 ATOM × $24 + 10 AKT × $2 = $96 + $20 = <span className="text-sun-200">$116</span>
      </Formula>
      <p>
        So 29 OSMO are worth $116, which gives us a value of <strong>$4 per OSMO</strong> ($116 / 29). Every time a pool
        that includes OSMO is added to Osmosis, more OSMO are required to maintain the price of an OSMO. For example,
        let&apos;s say a Bitsong is worth $0.20 on a second exchange. A third pool, BTSG/OSMO, is created with 100 BTSG
        ($20) and 5 new OSMO (4 × 5 = $20). Now the TVL of non-OSMO assets is $136 and there are 34 (29 + 5) OSMO in the
        pools. $136 / 34 is $4. The price of an OSMO stayed the same, but now it takes 34 OSMO in the pools to hold that
        price.
      </p>

      <h3>What if the creator of the BTSG/OSMO pool didn&apos;t have 5 additional OSMO?</h3>
      <p>What if they only had 3 OSMO in their wallet? Now the pools look like this:</p>
      <DataList
        rows={[
          { label: 'Pool 1 · 4 ATOM / 24 OSMO', value: '1 OSMO = 1/6 ATOM', note: '= $4.00' },
          { label: 'Pool 2 · 10 AKT / 5 OSMO', value: '1 OSMO = 2 AKT', note: '= $4.00' },
          { label: 'Pool 3 · 100 BTSG / 3 OSMO', value: '1 OSMO ≈ 33.3 BTSG', note: '≈ $6.67' },
        ]}
      />
      <p>
        One of these things is not like the other. The OSMO in pool 3 are overpriced! Fortunately for us, there are
        arbitrage bots that look for these situations and correct them. They do this by moving OSMO from the undervalued
        pools (1 and 2) into the overvalued pool (3). The bots take the mispriced tokens and sell or swap them for a
        profit. We won&apos;t delve too deeply into this process as it&apos;s not the primary focus of this post, but at
        the end of the day all the pools will be balanced again. If we look at our TVL from before ($136) and our number
        of OSMO (29 + 3 = 32), we can see that the price of an OSMO in this situation is $136 / 32 ={' '}
        <strong>$4.25</strong>. So adding a new OSMO pool ended up helping the price.
      </p>
      <p>
        On the other hand, adding a new pool with too many OSMO can reduce the price. Imagine that pool 3 was created with
        100 BTSG / 107 OSMO. The same bots would come and move everything around, but when we look at our TVL ($136) vs
        number of OSMO (29 + 107 = 136), an OSMO is suddenly worth <strong>$1</strong>! The value of an OSMO went down as
        significantly more OSMO were added to the pool than TVL.
      </p>

      <h2>What about non-OSMO pools?</h2>
      <p>
        Pools that don&apos;t contain OSMO are helpful in maintaining stable prices and cheaper exchange rates. The
        downside of these pools is that their TVL does not impact the price of an OSMO. No matter how many tokens sit in
        these pools, there&apos;s no need to match their value with OSMO, so they don&apos;t place any positive or
        negative pressure on the price of an OSMO.
      </p>
      <p>
        What if those pools didn&apos;t exist? What if every pool had to be an OSMO/X pool? How would that impact the
        price of an OSMO over time? To calculate that, we simply have to take the TVL of non-OSMO pools and add it to the
        existing formula.
      </p>
      <p>
        We cannot simply assume everyone would keep their tokens in Osmosis if they had to use an OSMO pool. Perhaps they
        would not have joined Osmosis in the first place if non-OSMO pools didn&apos;t exist. We&apos;ll consider three
        situations:
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>50% of the TVL in non-OSMO pools migrates to OSMO pools.</li>
        <li>100% of the TVL in non-OSMO pools migrates to OSMO pools.</li>
        <li>None of the TVL stays, and there&apos;s less adoption due to forced OSMO usage.</li>
      </ol>
      <p>Let&apos;s take a look at the last few months of Osmosis price action:</p>
      <Figure title="OSMO price: actual vs scenarios" caption="Daily, Oct 2021 – Feb 13, 2022 · dashed lines are modeled scenarios" wide>
        <LineChart
          data={price}
          index="date"
          height={320}
          format="usd"
          series={[
            { key: 'bullish', name: '100% migrates (bullish)', color: palette.turquoise, dashed: true },
            { key: 'half', name: '50% migrates', color: palette.lapis, dashed: true },
            { key: 'actual', name: 'Actual price', color: palette.sun },
            { key: 'bearish', name: 'TVL leaves (bearish)', color: palette.carnelian, dashed: true },
          ]}
        />
      </Figure>
      <p>
        The solid line is the actual price; the dashed lines are modeled scenarios. The bullish case shows an OSMO
        all-time high of almost <strong>$17.00</strong> when accounting for all TVL — roughly a two-thirds increase over
        the actual OSMO ATH. The bearish case has OSMO never breaking $10, and closer to $6 today.
      </p>
      <p>
        While it may still be tempting to remove or disincentivize non-OSMO pools, note that the market itself is
        already heading in that direction:
      </p>
      <Figure title="Share of TVL paired with OSMO" caption="Weekly, late Oct 2021 – mid Feb 2022">
        <AreaChart
          data={pairedShare}
          index="date"
          height={260}
          format="pct0"
          showLegend={false}
          series={[{ key: 'paired', name: 'TVL paired with OSMO', color: palette.sun }]}
        />
      </Figure>
      <p>
        From late October to mid-February, we&apos;ve seen the share of TVL paired with OSMO grow from ~50% to almost 65%.
        OSMO pools already have an incentive bias for both external and internal incentives. This paradigm shift is
        likely owed to the growth of Osmosis as a whole, and has strengthened general belief in the OSMO token.
        SuperFluid Staking should have a similar impact as well.
      </p>
      <p>
        Overall, the general trend has been positive for Osmosis, with lots of good things to look forward to. I hope that
        in reading this, you&apos;ve come to understand how an OSMO is priced, and why TVL is critical for the value of
        both the Osmosis DEX and the OSMO token.
      </p>
    </Article>
  )
}
