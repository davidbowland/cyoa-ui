import React, { useCallback, useEffect, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import ChoiceDisplay from '@components/choice-display'
import { fetchCyoaGame, fetchChoice } from '@services/cyoa'
import { CyoaGame, GameId, CyoaChoice, ChoiceId } from '@types'

const POLL_TIME_MS = 2_000

export interface StoryEngineProps {
  gameId: GameId
}

const StoryEngine = ({ gameId }: StoryEngineProps): React.ReactNode => {
  const [choiceId, setChoiceId] = useState<ChoiceId>('')
  const [currentChoice, setCurrentChoice] = useState<CyoaChoice | null>(null)
  const [currentGame, setCurrentGame] = useState<CyoaGame | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const pollForChoice = useCallback(async (gameId: GameId, choiceId: ChoiceId): Promise<void> => {
    try {
      const { data: choice, isGenerating } = await fetchChoice(gameId, choiceId)
      if (isGenerating) {
        setTimeout(pollForChoice, POLL_TIME_MS, gameId, choiceId)
        return
      }
      setCurrentChoice(choice)
      setIsLoading(false)
    } catch (error: unknown) {
      console.error('pollForChoice', { error })
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
      setChoiceId(game.initialChoiceId)

      await pollForChoice(gameId, game.initialChoiceId)
    } catch (error: unknown) {
      console.error('loadInitialGame', { error })
      setError('Failed to load game. Please refresh the page to try again.')
      setCurrentGame(null)
      setCurrentChoice(null)
      setIsLoading(false)
    }
  }, [gameId, pollForChoice])

  const handleChoiceSelect = useCallback(
    async (optionIndex: number): Promise<void> => {
      if (!currentChoice) return

      setIsLoading(true)
      setError(null)

      const nextChoiceId = `${choiceId}-${optionIndex}`
      setChoiceId(nextChoiceId)
      await pollForChoice(gameId, nextChoiceId)
    },
    [gameId, choiceId, currentChoice, pollForChoice],
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
    <ChoiceDisplay
      choice={currentChoice}
      errorMessage={error}
      game={currentGame}
      loading={isLoading}
      onChoiceSelect={handleChoiceSelect}
    />
  )
}

export default StoryEngine
