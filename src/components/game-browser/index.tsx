import { navigate } from 'gatsby'
import React, { useCallback } from 'react'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { CyoaGameBulk, GameId } from '@types'

export interface GameBrowserProps {
  games: CyoaGameBulk[]
  loading: boolean
  errorMessage?: string | null
}

interface GameCardProps {
  game: CyoaGameBulk
  onGameSelect: (gameId: GameId) => void
}

const GameCard = ({ game, onGameSelect }: GameCardProps): React.ReactNode => (
  <Card
    aria-describedby={`game-description-${game.gameId}`}
    aria-labelledby={`game-title-${game.gameId}`}
    component="article"
    sx={{ maxWidth: 800, width: '100%' }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: { md: 'row', xs: 'column' },
      }}
    >
      {game.image ? (
        <CardMedia
          alt={`${game.title} cover image`}
          component="img"
          image={game.image}
          sx={{
            height: { md: 'auto', xs: 150 },
            maxHeight: { md: 'none', xs: '100%' },
            maxWidth: { md: '100%', xs: 'none' },
            objectFit: 'cover',
            width: { md: 150, xs: 'auto' },
          }}
        />
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'grey.200',
            display: 'flex',
            height: { md: 'auto', xs: 150 },
            justifyContent: 'center',
            maxWidth: { md: '100%', xs: 'none' },
            minHeight: { md: 120, xs: 'auto' },
            width: { md: 150, xs: 'auto' },
          }}
        >
          <MenuBookIcon data-testid="MenuBookIcon" sx={{ color: 'grey.400', fontSize: '4rem' }} />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h3" gutterBottom id={`game-title-${game.gameId}`} variant="h6">
            {game.title}
          </Typography>
          <Typography color="text.secondary" id={`game-description-${game.gameId}`} variant="body2">
            {game.description}
          </Typography>
        </CardContent>

        {/* Mobile button - below description */}
        <Box
          sx={{
            alignItems: 'center',
            display: { md: 'none', xs: 'flex' },
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Button
            aria-label={`Play ${game.title}`}
            onClick={() => onGameSelect(game.gameId)}
            size="large"
            sx={{ minWidth: '100px' }}
            variant="contained"
          >
            Play
          </Button>
        </Box>
      </Box>

      {/* Desktop button - on the right */}
      <Box
        sx={{
          alignItems: 'center',
          display: { md: 'flex', xs: 'none' },
          p: 2,
        }}
      >
        <Button
          aria-label={`Play ${game.title}`}
          onClick={() => onGameSelect(game.gameId)}
          size="large"
          sx={{ minWidth: '100px' }}
          variant="contained"
        >
          Play
        </Button>
      </Box>
    </Box>
  </Card>
)

const LoadingSkeleton = (): React.ReactNode => (
  <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={`skeleton-${index}`} sx={{ maxWidth: 800, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { md: 'row', xs: 'column' },
          }}
        >
          <Skeleton height={150} sx={{ display: { md: 'none', xs: 'block' } }} variant="rectangular" width="100%" />
          <Skeleton height={120} sx={{ display: { md: 'block', xs: 'none' } }} variant="rectangular" width={150} />
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Skeleton height={32} variant="text" width="60%" />
              <Skeleton height={20} variant="text" />
              <Skeleton height={20} variant="text" width="80%" />
            </CardContent>

            {/* Mobile skeleton button */}
            <Box
              sx={{
                alignItems: 'center',
                display: { md: 'none', xs: 'flex' },
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Skeleton height={36} variant="rectangular" width={80} />
            </Box>
          </Box>

          {/* Desktop skeleton button */}
          <Box
            sx={{
              alignItems: 'center',
              display: { md: 'flex', xs: 'none' },
              p: 2,
            }}
          >
            <Skeleton height={36} variant="rectangular" width={80} />
          </Box>
        </Box>
      </Card>
    ))}
  </Box>
)

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
        <LoadingSkeleton />
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
            <GameCard game={game} key={game.gameId} onGameSelect={handleGameSelect} />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default GameBrowser
