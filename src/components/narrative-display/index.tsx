import { navigate } from 'gatsby'
import React, { useCallback } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChoiceHandler from '@components/choice-handler'
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
      <Box>
        <Button onClick={handleBack} sx={{ mb: 2 }} variant="outlined">
          ← Back to Games
        </Button>
        <Alert aria-live="polite" role="alert" severity="error">
          {errorMessage}
        </Alert>
      </Box>
    )
  }

  if (loading || !game || !narrative) {
    return (
      <Box>
        <Button onClick={handleBack} sx={{ mb: 2 }} variant="outlined">
          ← Back to Games
        </Button>
        <Card>
          <CardContent>
            <Skeleton height={40} variant="text" width="60%" />
            <Skeleton height={20} sx={{ mt: 2 }} variant="text" />
            <Skeleton height={20} variant="text" />
            <Skeleton height={20} variant="text" width="80%" />
            <Divider sx={{ my: 2 }} />
            <Skeleton height={24} variant="text" width="40%" />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Skeleton height={32} variant="rectangular" width={80} />
              <Skeleton height={32} variant="rectangular" width={100} />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Skeleton height={24} variant="text" width="30%" />
            <Skeleton height={36} sx={{ mt: 1 }} variant="rectangular" width="100%" />
            <Skeleton height={36} sx={{ mt: 1 }} variant="rectangular" width="100%" />
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <Button onClick={handleBack} sx={{ mb: 2 }} variant="outlined">
        ← Back to Games
      </Button>

      <Card>
        <CardContent>
          <Typography component="h1" gutterBottom variant="h4">
            {game.title}
          </Typography>

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

          {narrative.inventory.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography component="h3" gutterBottom variant="h6">
                Inventory
              </Typography>
              <Stack direction="row" flexWrap="wrap" spacing={1}>
                {narrative.inventory.map((item, index) => (
                  <Chip key={`inventory-${index}`} label={item} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography component="h3" gutterBottom variant="h6">
            {narrative.choice}
          </Typography>

          <ChoiceHandler disabled={loading} onChoiceSelect={onChoiceSelect} options={narrative.options} />
        </CardContent>
      </Card>
    </Box>
  )
}

export default NarrativeDisplay
