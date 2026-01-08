import { useEffect, useState } from 'react'

import { fetchCyoaGames } from '@services/cyoa'
import { CyoaGameBulk } from '@types'

export interface UseCyoaGamesResult {
  errorMessage: string | null
  games: CyoaGameBulk[]
  isLoading: boolean
}

export const useCyoaGames = (): UseCyoaGamesResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [games, setGames] = useState<CyoaGameBulk[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchCyoaGames()
      .then((response) => {
        setGames(response)
        setIsLoading(false)
      })
      .catch((error: unknown) => {
        console.error('fetchCyoaGames', { error })
        setErrorMessage('Unable to load games')
        setIsLoading(false)
      })
  }, [])

  return { errorMessage, games, isLoading }
}
