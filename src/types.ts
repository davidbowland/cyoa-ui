export { Theme } from '@mui/material/styles'

// API

export type GameId = string
export type NarrativeId = string

export interface CyoaGame {
  title: string
  description: string
  image?: string
  resourceName: string
  initialNarrativeId: NarrativeId
}

export interface CyoaGameBulk extends CyoaGame {
  gameId: GameId
}

export interface Narrative {
  narrative: string
  choice: string
  options: CyoaOption[]
  inventory: string[]
  currentResourceValue: number
}

export interface CyoaOption {
  name: string
}
