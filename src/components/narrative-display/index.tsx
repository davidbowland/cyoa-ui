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
          <Skeleton height={20} sx={{ mt: 2 }} variant="text" />
          <Skeleton height={20} variant="text" />
          <Skeleton height={20} variant="text" width="80%" />
          <Divider sx={{ my: 2 }} />
          <Skeleton height={24} variant="text" width="40%" />
          <Skeleton height={32} sx={{ mt: 1 }} variant="rectangular" width={80} />
          <Skeleton height={32} sx={{ mt: 1 }} variant="rectangular" width={100} />
          <Divider sx={{ my: 2 }} />
          <Skeleton height={24} variant="text" width="30%" />
          <Skeleton height={36} sx={{ mt: 1 }} variant="rectangular" width="100%" />
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
        <Typography component="p" sx={{ mb: 2, whiteSpace: 'pre-wrap' }} variant="body1">
          {narrative.narrative}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography component="h2" gutterBottom variant="h6">
            Current Status
          </Typography>
          <Typography component="p" variant="body2">
            <strong>{game.resourceName}:</strong> {narrative.currentResourceValue}
          </Typography>
        </Box>

        <InventoryDisplay items={narrative.inventory} />

        <Divider sx={{ my: 2 }} />

        <Typography component="h3" gutterBottom variant="h6">
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
