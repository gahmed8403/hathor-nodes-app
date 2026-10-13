import type { Metadata } from 'next'
import { Article, Callouts, Figure, Lede } from '@/components/blog/article'
import { BarChart, LineChart } from '@/components/charts'
import { getGovernanceAnalyst } from '@/lib/mock/blog-recent'
import { palette } from '@/lib/palette'

export const metadata: Metadata = {
  title: 'What we learned building an AI governance analyst',
  description:
    'Four iterations of an AI assistant that reads governance proposals: what improved accuracy, what did not, and why a human stays in the loop.',
}

export default function GovernanceAnalystPost() {
  const { iterations, time } = getGovernanceAnalyst()
  const first = time.slice(0, 4).reduce((a, t) => a + t.assisted, 0) / 4
  const last = time.slice(-4).reduce((a, t) => a + t.assisted, 0) / 4

  return (
    <Article slug="building_an_ai_governance_analyst">
      <Lede>
        Running a validator means reading every governance proposal, including the 40-page software upgrades and the
        parameter tweaks hidden in JSON. This year we built an AI assistant to help. Here is an honest account of how
        it went.
      </Lede>
      <p>
        Our goal was not to automate voting. We vote ourselves, and we publish our reasoning. The goal was to cut the
        time spent getting from “new proposal” to “we understand what it does and who it affects”, so we could spend
        that time on the judgment calls.
      </p>

      <h2>Four versions, one lesson</h2>
      <p>
        We measured each version against a set of past proposals where we already knew the right answer: what changed,
        what it costs, and what the risks are. A summary counted as accurate only if an analyst would sign it unchanged.
      </p>
      <Figure title="Summary accuracy by version" caption="Share of summaries an analyst approved without edits, past proposals." wide>
        <BarChart
          data={iterations}
          index="version"
          height={280}
          format="pct0"
          maxValue={100}
          series={[
            { key: 'accuracy', name: 'Accurate', color: palette.turquoise },
            { key: 'flagged', name: 'Needed correction', color: palette.carnelian },
          ]}
        />
      </Figure>
      <ul>
        <li>
          <strong>v1, prompt only.</strong> Fluent, confident and wrong about a quarter of the time, usually on the
          details that matter, like amounts and parameter values.
        </li>
        <li>
          <strong>v2, with the full proposal text.</strong> Much better, but it still could not tell what a parameter
          change meant without knowing the current value.
        </li>
        <li>
          <strong>v3, with on-chain parameters.</strong> Giving it tools to read the live chain state was the biggest
          single jump. “Raises the max validator set from 150 to 175” beats “increases the validator set”.
        </li>
        <li>
          <strong>v4, with analyst review.</strong> The assistant drafts, a person checks and edits. Nearly every
          published summary is now right, and the corrections feed back into our evaluation set.
        </li>
      </ul>

      <h2>Time saved</h2>
      <p>
        The time savings grew as the team learned to trust the drafts and focus their review on the risky sections.
      </p>
      <Figure title="Minutes per proposal" caption="Average analyst time per proposal, manual vs AI-assisted, over 20 weeks.">
        <LineChart
          data={time}
          index="week"
          rawX
          height={260}
          series={[
            { key: 'manual', name: 'Manual', color: palette.mist },
            { key: 'assisted', name: 'AI-assisted', color: palette.sun },
          ]}
        />
      </Figure>
      <Callouts
        items={[
          { label: 'First month, assisted', value: `${Math.round(first)} min`, note: 'per proposal' },
          { label: 'Latest month, assisted', value: `${Math.round(last)} min`, note: 'per proposal' },
        ]}
      />

      <h2>What we would tell anyone building one</h2>
      <ul>
        <li>Give the model the chain state, not just the text. Most errors were missing context, not bad reasoning.</li>
        <li>Build an evaluation set from past decisions before you start. Without it you are just judging vibes.</li>
        <li>Make the assistant quote its sources. Reviewers move much faster when they can click through.</li>
        <li>Keep the vote human. AI is a great reader; accountability belongs to the validator.</li>
      </ul>
      <p>
        We now offer this as part of our <a href="/services#governance-intelligence">governance intelligence</a> work
        for DAOs and validators.
      </p>
    </Article>
  )
}
