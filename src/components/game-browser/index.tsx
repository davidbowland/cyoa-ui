import { navigate } from 'gatsby'
import React, { useCallback } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { CyoaGameBulk, GameId } from '@types'

export interface GameBrowserProps {
  games: CyoaGameBulk[]
  loading: boolean
  errorMessage?: string | null
}

const GameBrowser = ({ games, loading, errorMessage }: GameBrowserProps): React.ReactNode => {
  const handleGameSelect = useCallback((gameId: GameId): void => {
    navigate(`/story/${gameId}`)
  }, [])

  if (errorMessage) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert aria-live="polite" role="alert" severity="error">
          {errorMessage}
        </Alert>
      </Box>
    )
  }

  return (
    <Box component="main" role="main" sx={{ p: 3 }}>
      <Typography
        aria-label="Choose Your Own Adventure Games"
        component="h1"
        gutterBottom
        sx={{ mb: 4, textAlign: 'center' }}
        variant="h3"
      >
        Choose Your Own Adventure
      </Typography>

      {loading ? (
        <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} sx={{ maxWidth: 800, width: '100%' }}>
              <CardContent>
                <Skeleton height={32} variant="text" width="60%" />
                <Skeleton height={20} variant="text" />
                <Skeleton height={20} variant="text" width="80%" />
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Skeleton height={36} variant="rectangular" width={100} />
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : games.length === 0 ? (
        <Box aria-live="polite" role="status" sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" component="h2" variant="h6">
            No games available at the moment
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
            Please check back later for new adventures
          </Typography>
        </Box>
      ) : (
        <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {games.map((game) => (
            <Card
              aria-describedby={`game-description-${game.gameId}`}
              aria-labelledby={`game-title-${game.gameId}`}
              component="article"
              key={game.gameId}
              sx={{ maxWidth: 800, width: '100%' }}
            >
              <CardContent>
                <Typography component="h3" gutterBottom id={`game-title-${game.gameId}`} variant="h6">
                  {game.title}
                </Typography>
                <Typography color="text.secondary" id={`game-description-${game.gameId}`} variant="body2">
                  {game.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  aria-label={`Play ${game.title}`}
                  onClick={() => handleGameSelect(game.gameId)}
                  size="large"
                  sx={{ maxWidth: '100%', width: '250px' }}
                >
                  Play
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default GameBrowser
