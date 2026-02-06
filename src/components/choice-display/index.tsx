import { navigate } from 'gatsby'
import React, { useCallback, useRef } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import ChoiceHandler from '@components/choice-handler'
import InventoryDisplay from '@components/inventory-display'
import { CyoaGame, CyoaChoice } from '@types'

export interface ChoiceDisplayProps {
  game: CyoaGame | null
  choice: CyoaChoice | null
  loading: boolean
  errorMessage?: string | null
  onChoiceSelect: (optionIndex: number) => void
}

const ChoiceDisplay = ({
  game,
  choice,
  loading,
  errorMessage,
  onChoiceSelect,
}: ChoiceDisplayProps): React.ReactNode => {
  const handleBack = useCallback((): void => {
    navigate('/')
  }, [])

  const narrativeArea = useRef<HTMLDivElement>(null)

  const handleChoiceSelect = (optionIndex: number) => {
    narrativeArea.current && narrativeArea.current.scrollIntoView()
    onChoiceSelect(optionIndex)
  }

  if (errorMessage) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Alert aria-live="polite" role="alert" severity="error">
          {errorMessage}
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
          Back to games list
        </Button>
      </Box>
    )
  }

  if (loading || !game || !choice) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Skeleton height={40} variant="text" width="60%" />
        <Paper sx={{ maxWidth: 800, p: 3, width: '100%' }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Skeleton height={48} sx={{ borderRadius: 1, mx: 'auto' }} variant="rectangular" width={120} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Skeleton height={40} sx={{ mx: 'auto' }} variant="text" width="50%" />

          <Skeleton height={200} sx={{ borderRadius: 1, mt: 2 }} variant="rectangular" width="100%" />

          <Skeleton height={20} sx={{ mt: 2 }} variant="text" />
          <Skeleton height={20} variant="text" />
          <Skeleton height={20} variant="text" width="80%" />

          <Divider sx={{ my: 2 }} />

          <Skeleton height={40} sx={{ mx: 'auto' }} variant="text" width="30%" />

          <Skeleton height={20} sx={{ mt: 1 }} variant="text" width="90%" />

          <Skeleton height={36} sx={{ mt: 2 }} variant="rectangular" width="100%" />
          <Skeleton height={36} sx={{ mt: 1 }} variant="rectangular" width="100%" />
        </Paper>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
          Back to games list
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Typography component="h3" sx={{ textAlign: 'center' }} variant="h3">
        {game.title}
      </Typography>

      <Paper ref={narrativeArea} sx={{ maxWidth: 800, p: 3, width: '100%' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Paper
            elevation={2}
            sx={{
              alignItems: 'center',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              margin: '0 auto',
              maxWidth: '350px',
              px: 3,
              py: 1.5,
            }}
          >
            {game.resourceImage && (
              <Box
                alt={game.resourceName}
                component="img"
                src={game.resourceImage}
                sx={{
                  height: 48,
                  objectFit: 'contain',
                  width: 48,
                }}
              />
            )}
            <Typography component="div" variant="body1">
              {game.resourceName}:{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                {choice.currentResourceValue < game.startingResourceValue
                  ? `${choice.currentResourceValue} / ${game.startingResourceValue}`
                  : `${choice.currentResourceValue} / ${game.lossResourceThreshold}`}
              </span>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography component="h4" gutterBottom sx={{ textAlign: 'center' }} variant="h4">
          {choice.chapterTitle}
        </Typography>

        {choice.image && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Box
              alt={choice.chapterTitle}
              component="img"
              src={choice.image}
              sx={{
                aspectRatio: '16/9',
                borderRadius: 1,
                maxWidth: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
            />
          </Box>
        )}

        <Typography component="p" sx={{ mb: 2, whiteSpace: 'pre-wrap' }} variant="body1">
          {choice.narrative}
        </Typography>

        {choice.inventory && choice.inventory.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <InventoryDisplay items={choice.inventory} />
          </>
        )}

        {choice.choice && choice.options.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography component="h5" gutterBottom sx={{ textAlign: 'center' }} variant="h5">
              Decision
            </Typography>

            <Typography component="p" gutterBottom sx={{ fontWeight: 'bold', paddingBottom: '2em' }} variant="body1">
              {choice.choice}
            </Typography>

            <ChoiceHandler disabled={loading} onChoiceSelect={handleChoiceSelect} options={choice.options} />
          </>
        )}
      </Paper>

      <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
        Back to games list
      </Button>
    </Box>
  )
}

export default ChoiceDisplay
