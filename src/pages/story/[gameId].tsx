import React from 'react'

import Grid from '@mui/material/Grid'

import PrivacyLink from '@components/privacy-link'
import StoryEngine from '@components/story-engine'
import { GameId } from '@types'

export interface StoryPageProps {
  params: {
    gameId: GameId
  }
}

const StoryPage = ({ params }: StoryPageProps): React.ReactNode => {
  return (
    <main style={{ minHeight: '90vh' }}>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
          <StoryEngine gameId={params.gameId} />
          <PrivacyLink />
        </Grid>
      </Grid>
    </main>
  )
}

export const Head = () => <title>Choose Your Own Adventure | dbowland.com</title>

export default StoryPage
