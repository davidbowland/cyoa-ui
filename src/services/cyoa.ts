import axios from 'axios'

import { CyoaGame, CyoaGameBulk, GameId, Narrative, NarrativeId } from '@types'

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

interface NarrativeResponse {
  data: Narrative
  isGenerating: boolean
}

export const fetchNarrative = async (gameId: GameId, narrativeId: NarrativeId): Promise<NarrativeResponse> => {
  const response = await api.get(`/games/${gameId}/narratives/${narrativeId}`)
  return { data: response.data, isGenerating: response.status === 202 }
}
