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
  startingResourceValue: number
  lossResourceThreshold: number
}

export interface CyoaGameBulk extends CyoaGame {
  gameId: GameId
}

export interface InventoryItem {
  name: string
  image?: string
}

export interface Narrative {
  chapterTitle: string
  narrative: string
  choice: string
  options: CyoaOption[]
  inventory: InventoryItem[]
  currentResourceValue: number
}

export interface CyoaOption {
  name: string
}
