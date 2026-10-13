export type ChainSlug = 'osmosis' | 'juno' | 'bitsong' | 'stargaze' | 'lum'

export type Chain = {
  slug: ChainSlug
  name: string
  token: string
  color: string
  blurb: string
  delegateUrl: string
  validatorAddress?: string
  /** Whether the chain has a Resources tab with dashboards */
  hasResources: boolean
}

export const chains: Record<ChainSlug, Chain> = {
  osmosis: {
    slug: 'osmosis',
    name: 'Osmosis',
    token: 'OSMO',
    color: '#a879ff',
    blurb:
      'An advanced AMM protocol built using the Cosmos SDK that lets developers design, build, and deploy their own customized AMMs.',
    delegateUrl:
      'https://wallet.keplr.app/#/osmosis/stake?modal=stake&chainId=osmosis-1&validator=osmovaloper1qx6kgrla69wmz90tn379p4kaux5prdkucgvfuf',
    validatorAddress: 'osmovaloper1qx6kgrla69wmz90tn379p4kaux5prdkucgvfuf',
    hasResources: true,
  },
  juno: {
    slug: 'juno',
    name: 'Juno',
    token: 'JUNO',
    color: '#f0705a',
    blurb:
      'A permissionless, interoperable smart-contract hub for the Cosmos, built for CosmWasm developers.',
    delegateUrl: 'https://wallet.keplr.app/chains/juno',
    hasResources: true,
  },
  bitsong: {
    slug: 'bitsong',
    name: 'Bitsong',
    token: 'BTSG',
    color: '#ff5fa2',
    blurb:
      'Unlock the world of decentralized music with Bitsong. From music players to merchandise, Bitsong lets creatives and their fans enjoy art in a decentralized fashion.',
    delegateUrl:
      'https://wallet.bitsong.io/#/validators/bitsongvaloper1t26ag4sn8075dk27d8zp6dh30prnqzymcnee5a',
    validatorAddress: 'bitsongvaloper1t26ag4sn8075dk27d8zp6dh30prnqzymcnee5a',
    hasResources: true,
  },
  stargaze: {
    slug: 'stargaze',
    name: 'Stargaze',
    token: 'STARS',
    color: '#3cc6b5',
    blurb:
      'A decentralized, community-owned NFT Layer 1 chain and marketplace with CosmWasm smart contracts. 100% carbon neutral. Zero gas.',
    delegateUrl: 'https://wallet.keplr.app/chains/stargaze',
    hasResources: true,
  },
  lum: {
    slug: 'lum',
    name: 'Lum',
    token: 'LUM',
    color: '#7193ff',
    blurb:
      'A decentralized trust-building protocol for businesses. Strengthen customer–business ties and get access to dozens of discounts across the Lum Network.',
    delegateUrl:
      'https://explorer.lum.network/validators/lumvaloper1qx6kgrla69wmz90tn379p4kaux5prdkuqerqnv',
    validatorAddress: 'lumvaloper1qx6kgrla69wmz90tn379p4kaux5prdkuqerqnv',
    hasResources: false,
  },
}

/** Chains shown on the Resources tab bar, in order */
export const resourceChains: Chain[] = [chains.osmosis, chains.juno, chains.bitsong, chains.stargaze]

/** Chains Hathor Nodes validates on (Delegate page) */
export const validatedChains: Chain[] = [chains.osmosis, chains.stargaze, chains.bitsong, chains.lum]

/** Chains with a governance dashboard */
export const governanceChains: Chain[] = resourceChains

export function getChain(slug: string): Chain | undefined {
  return (chains as Record<string, Chain>)[slug]
}

export type Dashboard = {
  title: string
  href: string
  description: string
  icon: 'droplets' | 'layers' | 'landmark' | 'vote' | 'flask' | 'coins'
  badge?: string
}

/** Dashboards available on each chain's Resources tab */
export const dashboardsByChain: Record<string, Dashboard[]> = {
  osmosis: [
    {
      title: 'Incentives Optimization Research',
      href: '/incentives_research/osmosis',
      description:
        'Initial results from our research on how to ensure healthy liquidity on Osmosis while minimizing the cost of incentives.',
      icon: 'flask',
      badge: 'Research',
    },
    {
      title: 'Liquidity Provider Dashboard',
      href: '/liquidity_provider/osmosis',
      description:
        'The mainstay of Osmosis, its liquidity pools, contain a variety of assets from the Cosmos and beyond. Track the liquidity of tokens and their impact on the OSMO here.',
      icon: 'droplets',
    },
    {
      title: 'SuperFluid Staking Dashboard',
      href: '/super_fluid_staking/osmosis',
      description:
        'Providing the ability to both provide liquidity and stake, SuperFluid Staking (SFS) has been a game changer for Osmosis. Track its adoption by both pools and users.',
      icon: 'layers',
    },
    {
      title: 'Governance Dashboard',
      href: '/governance/osmosis',
      description: 'Up-to-date information on validator voting habits and participation rate.',
      icon: 'landmark',
    },
    {
      title: 'Validator Voting History',
      href: '/validator_voting_history/osmosis',
      description:
        'Need help picking a validator? See how every validator has voted on every proposal, and what share of proposals they have voted on since joining the set.',
      icon: 'vote',
    },
  ],
  juno: [
    {
      title: 'Governance Dashboard',
      href: '/governance/juno',
      description: 'Up-to-date information on validator voting habits and participation rate.',
      icon: 'landmark',
    },
    {
      title: 'Value Accrual Dashboard',
      href: '/value_accrual/juno',
      description: 'A breakdown of transaction fees generated by IBC transfers and smart contracts.',
      icon: 'coins',
      badge: 'Beta',
    },
  ],
  bitsong: [
    {
      title: 'Governance Dashboard',
      href: '/governance/bitsong',
      description: 'Up-to-date information on validator voting habits and participation rate.',
      icon: 'landmark',
    },
  ],
  stargaze: [
    {
      title: 'Governance Dashboard',
      href: '/governance/stargaze',
      description: 'Up-to-date information on validator voting habits and participation rate.',
      icon: 'landmark',
    },
  ],
}
