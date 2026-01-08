export { Theme } from '@mui/material/styles'

// API

export type GameId = string

export interface CyoaGame {
  title: string
  description: string
  image?: string
  resourceName: string
  initialNarrativeId: string
}

export interface CyoaGameBulk extends CyoaGame {
  gameId: string
}

export interface Narrative {
  recap: string
  currentResourceValue: number
  lastChoiceMade: string
  currentInventory: string[]
  inventoryToIntroduce: string[]
  keyInformationToIntroduce: string[]
  redHerringsToIntroduce: string[]
  inventoryOrInformationConsumed: string[]
  nextChoice: string
  options: CyoaOption[]
  generationStartTime: number
}

export interface CyoaOption {
  name: string
}

export interface GameIdsResponse {
  gameIds: GameId[]
}

// Legacy Connections Types (to be removed in later tasks)

export interface ConnectionsGame {
  categories: CategoryObject
}

// Categories

export interface Category {
  hint: string
  words: string[]
}

export interface CategoryObject {
  [key: string]: Category
}

export interface SolvedCategory {
  description: string
  words: string[]
}

// Colors

export interface GameColor {
  background: string
  text: string
}

export interface CategoryColors {
  [key: string]: GameColor
}
