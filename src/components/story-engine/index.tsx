import React, { useCallback, useEffect, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import NarrativeDisplay from '@components/narrative-display'
import { fetchCyoaGame, fetchNarrative } from '@services/cyoa'
import { CyoaGame, Narrative } from '@types'

export interface StoryEngineProps {
  gameId: string
}

const StoryEngine = ({ gameId }: StoryEngineProps): React.ReactNode => {
  const [currentGame, setCurrentGame] = useState<CyoaGame | null>(null)
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null)
  const [narrativeId, setNarrativeId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadInitialGame = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const game = await fetchCyoaGame(gameId)
      setCurrentGame(game)
      setNarrativeId(game.initialNarrativeId)

      const narrative = await fetchNarrative(gameId, game.initialNarrativeId)
      setCurrentNarrative(narrative)
      setLoading(false)
    } catch (error: unknown) {
      console.error('loadInitialGame', { error })
      setError('Failed to load game. Please refresh the page to try again.')
      setCurrentGame(null)
      setCurrentNarrative(null)
      setLoading(false)
    }
  }, [gameId])

  const handleChoiceSelect = useCallback(
    async (optionIndex: number): Promise<void> => {
      if (!currentNarrative) return

      try {
        setLoading(true)
        setError(null)

        const nextNarrativeId = `${narrativeId}-${optionIndex}`
        const narrative = await fetchNarrative(gameId, nextNarrativeId)

        setCurrentNarrative(narrative)
        setNarrativeId(nextNarrativeId)
        setLoading(false)
      } catch (error: unknown) {
        console.error('handleChoiceSelect', { error })
        setError('Failed to load next story segment. Please try again.')
        setLoading(false)
      }
    },
    [gameId, narrativeId, currentNarrative],
  )

  const handleRetry = useCallback((): void => {
    if (currentGame) {
      handleChoiceSelect(0)
    } else {
      loadInitialGame()
    }
  }, [currentGame, handleChoiceSelect, loadInitialGame])

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
      loading={loading}
      narrative={currentNarrative}
      onChoiceSelect={handleChoiceSelect}
    />
  )
}

export default StoryEngine
