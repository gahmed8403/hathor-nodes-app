import type { Metadata } from 'next'
import { Article, Callouts, Figure, Lede } from '@/components/blog/article'
import { LineChart } from '@/components/charts'
import { getValidatorParitySeries } from '@/lib/mock/blog'

export const metadata: Metadata = {
  title: 'Osmosis in Graphs: Validator Parity',
  description:
    'Skew and kurtosis of Osmosis validator voting power: how far the validator set sits from a normal distribution, and what that means for decentralization.',
}

// Chart colours (kept local: values exported from client modules aren't readable in server components)
const palette = {
  sun: '#e8b44c',
  lapis: '#7193ff',
  turquoise: '#3cc6b5',
  carnelian: '#f0705a',
  violet: '#a879ff',
}

export default function ValidatorParityPage() {
  const { rows, mean, median } = getValidatorParitySeries()

  return (
    <Article slug="validator_parity">
      <Lede>
        There is definitely a non-normal spread of voting power among validators. That&apos;s not necessarily a bad
        thing. This is not a critique of anyone&apos;s staking selection or of any validators in general!
      </Lede>
      <p>
        Currently, there&apos;s no incentive to stake with a smaller validator aside from your own desire to decentralize
        voting power and support individual validators&apos; efforts. Larger validators have pre-established
        reputations and are trusted for that reason.
      </p>

      <h2>Validator power</h2>
      <p>
        I was inspired by a lot of the recent Prop 120 discussions, a{' '}
        <a
          href="https://www.reddit.com/r/OsmosisLab/comments/ryfrpo/performance_of_validator_governance/"
          target="_blank"
          rel="noreferrer"
        >
          recent post
        </a>{' '}
        by u/Gohodoshii, plus{' '}
        <a
          href="https://docs.google.com/spreadsheets/d/1_4-ll5yU4LqWIcF6XCQW1YHC3TAYdbspYWSqAVoC6qo/edit"
          target="_blank"
          rel="noreferrer"
        >
          the spreadsheet u/JohnnyWyles maintains
        </a>
        .
      </p>
      <p>
        To assist in these discussions, I decided to bring out the relevant stats and graphs to demonstrate the lack of
        symmetry in voting power. In statistics, a lot of things are compared to the Normal Distribution (a.k.a. the
        bell curve). There are two metrics that indicate how far off a set of numbers — in this case the voting power of
        validators — is from the Normal Distribution.
      </p>

      <h3>Skew</h3>
      <p>
        The first of these metrics is <strong>skew</strong>. Skew tells us how symmetrical a set of numbers is. The more
        skewed the numbers, the higher or lower the skew, depending on which way it&apos;s skewed. Typically, any skew
        greater than 1 or less than −1 is considered &ldquo;highly skewed&rdquo; (though some people permit skews up to
        ±3, we don&apos;t need to sweat that too much here). Here is the skew of the Osmosis validator set:
      </p>
      <Figure title="Skew of validator voting power" caption="Sampled every 25,000 blocks" wide>
        <LineChart
          data={rows}
          index="block"
          rawX
          height={280}
          series={[{ key: 'skew', name: 'Skew', color: palette.sun }]}
          reference={{ y: 1, label: 'Highly skewed above 1', color: palette.carnelian }}
        />
      </Figure>
      <p>
        Note that for the most part, we sit around 4. That&apos;s highly skewed. This indicates that the mean (average)
        voting power for a validator is much higher than the median. You can see that here:
      </p>
      <Callouts
        items={[
          { label: 'Mean voting power', value: mean.toLocaleString('en-US'), note: 'OSMO per validator' },
          { label: 'Median voting power', value: median.toLocaleString('en-US'), note: '≈ ¼ of the mean' },
        ]}
      />
      <p>
        What&apos;s the difference between the mean and median? Think of the mean as a completely even split of the
        votes/staked OSMO. If we gave all the validators the same number of OSMO from the currently staked amount,
        they&apos;d all have ~682k OSMO staked to them. But the median tells us that half the validators actually have
        less than ~184k OSMO, roughly a quarter of that mean.
      </p>
      <p>That large difference is demonstrated by our skew!</p>

      <h3>Kurtosis</h3>
      <p>
        While skew looks at the middle of our set of numbers — the median and mean — <strong>kurtosis</strong> looks at
        the extremes, also known as the tails. In a bell curve, 99% of data points occur within 3 standard deviations of
        the median/mean. The normal distribution has a kurtosis of 3, so anything higher than that indicates we have
        more voting power in the edges of our dataset (i.e. very small or very large validators) than a bell curve
        would. With that said, let&apos;s take a look at Osmosis today:
      </p>
      <Figure title="Kurtosis of validator voting power" caption="Sampled every 25,000 blocks" wide>
        <LineChart
          data={rows}
          index="block"
          rawX
          height={280}
          series={[{ key: 'kurtosis', name: 'Kurtosis', color: palette.lapis }]}
          reference={{ y: 3, label: 'Normal distribution = 3', color: palette.turquoise }}
        />
      </Figure>
      <p>
        In statistics, we sometimes refer to those edge numbers as the tails of a distribution — and in this case,
        we&apos;d call these some pretty fat tails. There&apos;s definitely been a thinning out of the edges over time
        though, so perhaps that will continue to be the case as we go through 2022.
      </p>
    </Article>
  )
}
