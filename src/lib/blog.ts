export type Post = {
  slug: string
  title: string
  date: string
  readingTime: string
  excerpt: string
  tag: string
}

/** Newest first */
export const posts: Post[] = [
  {
    slug: 'stress_testing_lp_positions_with_ai',
    title: 'Stress-testing an LP position with AI, step by step',
    date: '2026-09-22',
    readingTime: '8 min read',
    tag: 'AI workflows',
    excerpt:
      'A walkthrough of the risk workflow we run for clients: an AI analyst pulls pool reserves and price history, runs 10,000 simulated paths, and explains what a 40% shock would actually do to an ATOM/OSMO position. Then a human checks the math.',
  },
  {
    slug: 'building_an_ai_governance_analyst',
    title: 'What we learned building an AI governance analyst',
    date: '2026-07-28',
    readingTime: '7 min read',
    tag: 'Governance',
    excerpt:
      'We have voted on hundreds of proposals as a validator. This year we built an AI assistant to help us read them. Four iterations later it summarizes proposals with 98% accuracy, but only once we gave it the on-chain parameters and kept a person in the loop.',
  },
  {
    slug: 'validator_parity_four_years_later',
    title: 'Validator Parity, four years later',
    date: '2026-05-12',
    readingTime: '5 min read',
    tag: 'Osmosis in Graphs',
    excerpt:
      'In 2022 we showed how skewed Osmosis voting power was. We have re-run the numbers every quarter since. The Nakamoto coefficient has nearly doubled and the top-10 share keeps falling. Here is what changed, and what still has not.',
  },
  {
    slug: 'grounding_ai_in_chain_data',
    title: 'Grounding AI in chain data: why tools beat clever prompts',
    date: '2026-02-17',
    readingTime: '6 min read',
    tag: 'AI workflows',
    excerpt:
      'We asked 250 real questions about on-chain data under four setups, from a bare prompt to an AI with live tool access and automated checks. Error rates fell from 38% to 1.5%. The difference was not the prompt; it was where the numbers came from.',
  },
  {
    slug: 'dao_treasury_risk_metrics',
    title: 'Five treasury risk metrics every DAO should track',
    date: '2025-11-04',
    readingTime: '6 min read',
    tag: 'Risk',
    excerpt:
      'Most DAO treasuries are one bad month away from a runway problem, and most do not know it. These are the five numbers we check first in every treasury review, and how to monitor them automatically.',
  },
  {
    slug: 'value_of_an_osmo',
    title: 'Osmosis in Graphs: The value of an Osmo',
    date: '2022-03-16',
    readingTime: '7 min read',
    tag: 'Osmosis in Graphs',
    excerpt:
      "Every day, millions of dollars are traded in and out of Osmosis pools. From users compounding their LP rewards to traders exchanging tokens, every transaction slowly yet surely increases the TVL of Osmosis. When the TVL of Osmosis increases, the price of an OSMO tends to follow. In this post, we're going to take a deep dive into the pricing of an OSMO.",
  },
  {
    slug: 'validator_parity',
    title: 'Osmosis in Graphs: Validator Parity',
    date: '2022-02-14',
    readingTime: '4 min read',
    tag: 'Osmosis in Graphs',
    excerpt:
      "There is definitely a non-normal spread of voting power among validators. That's not necessarily a bad thing, and this is not a critique of anyone's staking selection or of any validators in general. Currently, there's no incentive to stake with a smaller validator aside from your own desire to decentralize voting power and support individual validators' efforts.",
  },
  {
    slug: 'impermanent_loss_and_you',
    title: 'Impermanent Loss & You',
    date: '2022-01-29',
    readingTime: '5 min read',
    tag: 'Liquidity',
    excerpt:
      'Osmosis Governance recently approved another set of external incentive matching for the BTSG pools. How do these pools perform if you ignore incentives? Simply swap fees accrued vs impermanent loss. When you put tokens in a pool, you are investing in the GAMM itself.',
  },
]

export function getPost(slug: string) {
  const post = posts.find((p) => p.slug === slug)
  if (!post) throw new Error(`Unknown post: ${slug}`)
  return post
}

export const fmtPostDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
