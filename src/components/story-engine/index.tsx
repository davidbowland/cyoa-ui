import React, { useCallback, useEffect, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import NarrativeDisplay from '@components/narrative-display'
import { fetchCyoaGame, fetchNarrative } from '@services/cyoa'
import { CyoaGame, GameId, Narrative, NarrativeId } from '@types'

const POLL_TIME_MS = 2_000

export interface StoryEngineProps {
  gameId: GameId
}

const StoryEngine = ({ gameId }: StoryEngineProps): React.ReactNode => {
  const [currentGame, setCurrentGame] = useState<CyoaGame | null>(null)
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [narrativeId, setNarrativeId] = useState<NarrativeId>('')

  const pollForNarrative = useCallback(async (gameId: GameId, narrativeId: NarrativeId): Promise<void> => {
    try {
      const { data: narrative, isGenerating } = await fetchNarrative(gameId, narrativeId)
      if (isGenerating) {
        setTimeout(pollForNarrative, POLL_TIME_MS, gameId, narrativeId)
        return
      }
      setCurrentNarrative(narrative)
      setIsLoading(false)
    } catch (error: unknown) {
      console.error('pollForNarrative', { error })
      setError('Failed to load next story segment. Please try again.')
      setIsLoading(false)
    }
  }, [])

  const loadInitialGame = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const game = await fetchCyoaGame(gameId)
      setCurrentGame(game)
      setNarrativeId(game.initialNarrativeId)

      await pollForNarrative(gameId, game.initialNarrativeId)
    } catch (error: unknown) {
      console.error('loadInitialGame', { error })
      setError('Failed to load game. Please refresh the page to try again.')
      setCurrentGame(null)
      setCurrentNarrative(null)
      setIsLoading(false)
    }
  }, [gameId, pollForNarrative])

  const handleChoiceSelect = useCallback(
    async (optionIndex: number): Promise<void> => {
      if (!currentNarrative) return

      setIsLoading(true)
      setError(null)

      const nextNarrativeId = `${narrativeId}-${optionIndex}`
      setNarrativeId(nextNarrativeId)
      await pollForNarrative(gameId, nextNarrativeId)
    },
    [gameId, narrativeId, currentNarrative, pollForNarrative],
  )

  const handleRetry = useCallback((): void => {
    loadInitialGame()
  }, [loadInitialGame])

  useEffect(() => {
    loadInitialGame()
  }, [loadInitialGame])

  if (error && !currentGame) {
    return (
      <Box>
        <Alert aria-live="polite" role="alert" severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleRetry} variant="contained">
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <NarrativeDisplay
      errorMessage={error}
      game={currentGame}
      loading={isLoading}
      narrative={currentNarrative}
      onChoiceSelect={handleChoiceSelect}
    />
  )
}

export default StoryEngine
