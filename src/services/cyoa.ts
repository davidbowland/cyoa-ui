import axios from 'axios'

import { CyoaGame, CyoaGameBulk, GameId, CyoaChoice, ChoiceId } from '@types'

const api = axios.create({
  baseURL: process.env.GATSBY_CYOA_API_BASE_URL,
  timeout: 35_000, // 35 seconds
})

export const fetchCyoaGames = async (): Promise<CyoaGameBulk[]> => {
  const response = await api.get('/games')
  return response.data
}

export const fetchCyoaGame = async (gameId: GameId): Promise<CyoaGame> => {
  const response = await api.get(`/games/${gameId}`)
  return response.data
}

interface ChoiceResponse {
  data: CyoaChoice
  isGenerating: boolean
}

export const fetchChoice = async (gameId: GameId, choiceId: ChoiceId): Promise<ChoiceResponse> => {
  const response = await api.get(`/games/${gameId}/choices/${choiceId}`)
  return { data: response.data, isGenerating: response.status === 202 }
}
