export { Theme } from '@mui/material/styles'

// API

export type GameId = string
export type ChoiceId = string

export interface CyoaGame {
  title: string
  description: string
  image?: string
  resourceName: string
  resourceImage?: string
  initialChoiceId: ChoiceId
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

export interface CyoaChoice {
  chapterTitle: string
  image?: string
  narrative: string
  choice?: string
  options: CyoaOption[]
  inventory: InventoryItem[]
  currentResourceValue: number
}

export interface CyoaOption {
  name: string
}
