import { navigate } from 'gatsby'
import React, { useCallback } from 'react'

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
import { CyoaGame, Narrative } from '@types'

export interface NarrativeDisplayProps {
  game: CyoaGame | null
  narrative: Narrative | null
  loading: boolean
  errorMessage?: string | null
  onChoiceSelect: (optionIndex: number) => void
}

const NarrativeDisplay = ({
  game,
  narrative,
  loading,
  errorMessage,
  onChoiceSelect,
}: NarrativeDisplayProps): React.ReactNode => {
  const handleBack = useCallback((): void => {
    navigate('/')
  }, [])

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

  if (loading || !game || !narrative) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Skeleton height={40} variant="text" width="60%" />
        <Paper sx={{ maxWidth: 800, p: 3, width: '100%' }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Skeleton height={48} sx={{ borderRadius: 1, mx: 'auto' }} variant="rectangular" width={120} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Skeleton height={40} sx={{ mx: 'auto' }} variant="text" width="50%" />

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
      <Typography component="h1" sx={{ textAlign: 'center' }} variant="h4">
        {game.title}
      </Typography>

      <Paper sx={{ maxWidth: 800, p: 3, width: '100%' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Paper
            elevation={2}
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              display: 'inline-block',
              px: 3,
              py: 1.5,
            }}
          >
            <Typography component="div" variant="body1">
              {game.resourceName}:{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                {narrative.currentResourceValue < game.startingResourceValue
                  ? `${narrative.currentResourceValue} / ${game.startingResourceValue}`
                  : `${narrative.currentResourceValue} / ${game.lossResourceThreshold}`}
              </span>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography component="h4" gutterBottom sx={{ textAlign: 'center' }} variant="h4">
          {narrative.chapterTitle}
        </Typography>

        <Typography component="p" sx={{ mb: 2, whiteSpace: 'pre-wrap' }} variant="body1">
          {narrative.narrative}
        </Typography>

        {narrative.inventory && narrative.inventory.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <InventoryDisplay items={narrative.inventory} />
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography component="h4" gutterBottom sx={{ textAlign: 'center' }} variant="h4">
          Decision
        </Typography>

        <Typography component="p" gutterBottom sx={{ fontWeight: 'bold', paddingBottom: '2em' }} variant="body1">
          {narrative.choice}
        </Typography>

        <ChoiceHandler disabled={loading} onChoiceSelect={onChoiceSelect} options={narrative.options} />
      </Paper>

      <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
        Back to games list
      </Button>
    </Box>
  )
}

export default NarrativeDisplay
