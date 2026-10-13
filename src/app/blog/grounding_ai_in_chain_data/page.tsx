import type { Metadata } from 'next'
import { Article, DataList, Figure, Lede } from '@/components/blog/article'
import { BarChart } from '@/components/charts'
import { getGroundingResults } from '@/lib/mock/blog-recent'
import { palette } from '@/lib/palette'

export const metadata: Metadata = {
  title: 'Grounding AI in chain data: why tools beat clever prompts',
  description:
    'An experiment with 250 on-chain data questions across four AI setups, and why giving AI direct access to chain data matters more than prompt wording.',
}

export default function GroundingPost() {
  const { setups, questions } = getGroundingResults()

  return (
    <Article slug="grounding_ai_in_chain_data">
      <Lede>
        Ask an AI model what the TVL of a pool was last Tuesday and you will get a confident, nicely formatted answer.
        The question is whether it is true.
      </Lede>
      <p>
        Before we used AI on client work, we wanted to know how much to trust it with on-chain questions. So we ran an
        experiment. We wrote {questions} questions of the kind our clients actually ask, with answers we could verify
        from chain, and tried four setups.
      </p>
      <DataList
        rows={[
          { label: 'Prompt only', value: 'The question, nothing else' },
          { label: 'Pasted data', value: 'A relevant data export pasted into the prompt' },
          { label: 'Tool access', value: 'Live, read-only tools for RPC, indexer and prices' },
          { label: 'Tools + checks', value: 'Tool access plus automated recalculation of every figure' },
        ]}
      />

      <h2>Results</h2>
      <p>
        We scored each answer two ways. Was it wrong? And could a reviewer verify it from the answer alone, with sources
        cited and numbers traceable?
      </p>
      <Figure title="Answer quality by setup" caption={`${questions} on-chain data questions · lower is better.`} wide>
        <BarChart
          data={setups}
          index="setup"
          height={280}
          format="pct0"
          series={[
            { key: 'error', name: 'Wrong answers', color: palette.carnelian },
            { key: 'unverifiable', name: 'Unverifiable answers', color: palette.slate },
          ]}
        />
      </Figure>
      <p>
        The jump from “prompt only” to “tool access” dwarfs anything we got from rewording prompts. A model with no data
        does not know it has no data; it fills the gap with something plausible. Give it a way to look things up, and
        it looks things up.
      </p>

      <h2>Why pasted data is not enough</h2>
      <p>
        Pasting an export helps, but it breaks down quickly. Exports go stale, they rarely contain everything a
        follow-up question needs, and long tables are where small transcription errors creep in. Tools let the model
        fetch exactly what it needs, when it needs it, and leave a log a reviewer can check.
      </p>

      <h2>Design rules we now follow</h2>
      <ul>
        <li>
          <strong>Read-only by default.</strong> Data tools never sign transactions. Anything that acts goes through a
          separate, human-approved path.
        </li>
        <li>
          <strong>Every number has a source.</strong> Answers cite the tool call behind each figure.
        </li>
        <li>
          <strong>Recompute, don’t trust.</strong> Key figures are recalculated by plain code before they are shown.
        </li>
        <li>
          <strong>Say “I don’t know”.</strong> If a tool fails, the answer must say so instead of estimating.
        </li>
      </ul>
      <p>
        These rules underpin every workflow we build for clients. You can see one in action in{' '}
        <a href="/blog/stress_testing_lp_positions_with_ai">our LP stress-test walkthrough</a>.
      </p>
    </Article>
  )
}
