export type EventType = Event['event']
export type Event = EventNewBlock|EventVote|EventNewBlockHeader|EventTx
|EventNewRoundStep|EventPolka|EventLock|EventNewRound|EventValidBlock|EventCompleteProposal


export interface EventTx {
  cursor: string
  event: 'Tx'
  data: {
    type: 'tendermint/event/Tx'
    value: {
      height: number
      tx: string
      result: {
        data: string
        gas_wanted: 1,
      }
    }
  }
}

export interface EventNewBlock {
  cursor: string
  event: 'NewBlock'
  data: {
    type: 'tendermint/event/NewBlock',
    value: {
      block: {
        header: BlockHeader
        data: {
          txns: any[]
        }
      },
      block_id: BlockId
    }
  }
}

export interface EventLock {
  cursor: string
  event: 'Lock'
  data: {
    type: 'tendermint/event/RoundState',
    value: RoundState
  }
}

export interface EventPolka {
  cursor: string
  event: 'Polka'
  data: {
    type: 'tendermint/event/RoundState',
    value: RoundState
  }
}

export interface EventValidBlock {
  cursor: string
  event: 'ValidBlock'
  data: {
    type: 'tendermint/event/RoundState',
    value: RoundState
  }
}

export interface EventNewRound {
  cursor: string
  event: 'NewRound'
  data: {
    type: 'tendermint/event/NewRound',
    value: NewRoundValue
  }
}

export interface EventVote {
  cursor: string
  event: 'Vote'
  data: {
    type: 'tendermint/event/Vote',
    value: {
      Vote: Vote
    }
  }
}

export interface EventNewBlockHeader {
  cursor: string
  event: 'NewBlockHeader'
  data: {
    type: 'tendermint/event/NewBlockHeader',
    value: {
      header: BlockHeader
      num_txns: number
    }
  }
}

export interface EventNewRoundStep {
  cursor: string
  event: 'NewRoundStep'
  data: {
    type: 'tendermint/event/RoundState',
    value: {
      height: string
      round: number
      step: string
    }
  }
}

export interface EventCompleteProposal {
  cursor: string
  event: 'CompleteProposal'
  data: {
    type: 'tendermint/event/CompleteProposal',
    value: {
      height: string
      round: number
      step: string
      block_id: BlockId
    }
  }
}

export interface BlockId {
  hash: string,
  parts: {
    total: number,
    hash: string
  }
}

export interface BlockHeader {
  version: {
    block: number,
    app: number
  },
  height: number,
  time: string // ISO-date
  last_block_id: BlockId
  last_commit_hash: string
  data_hash: string
  validators_hash: string
  next_validators_hash: string
  consensus_hash: string
  app_hash: string
  last_results_hash: string
  evidence_hash: string
  proposer_address: string
}

export interface Vote {
  type: number
  height: number
  round: number
  block_id: BlockId
  timestamp: string // ISO
  validator_address: string
  validator_index: number
  signature: string
}

export interface RoundState {
  height: string
  round: number
  step: string
}

export interface NewRoundValue extends RoundState {
  proposed: string
  index: number
}