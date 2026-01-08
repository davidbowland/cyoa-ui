import { navigate } from 'gatsby'
import React, { useCallback } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
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
        <Grid aria-label="Loading games" container role="status" spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item key={`skeleton-${index}`} md={4} sm={6} xs={12}>
              <Card aria-hidden="true">
                <Skeleton height={200} variant="rectangular" />
                <CardContent>
                  <Skeleton height={32} variant="text" />
                  <Skeleton height={20} variant="text" />
                  <Skeleton height={20} variant="text" width="60%" />
                </CardContent>
                <CardActions>
                  <Skeleton height={36} variant="rectangular" width={80} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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
        <Grid aria-label="Available games" container role="list" spacing={3}>
          {games.map((game) => (
            <Grid item key={game.gameId} md={4} role="listitem" sm={6} xs={12}>
              <Card
                aria-describedby={`game-description-${game.gameId}`}
                aria-labelledby={`game-title-${game.gameId}`}
                component="article"
                sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {game.image && (
                  <CardMedia
                    alt={`Cover image for ${game.title}`}
                    component="img"
                    height="200"
                    image={game.image}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography component="h3" gutterBottom id={`game-title-${game.gameId}`} variant="h6">
                    {game.title}
                  </Typography>
                  <Typography color="text.secondary" id={`game-description-${game.gameId}`} variant="body2">
                    {game.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    aria-label={`Play ${game.title}`}
                    onClick={() => handleGameSelect(game.gameId)}
                    size="small"
                    variant="contained"
                  >
                    Play Game
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default GameBrowser
