import React from 'react'

import GameBrowser from '@components/game-browser'
import { useCyoaGames } from '@hooks/useCyoaGames'

const Index = (): React.ReactNode => {
  const { errorMessage, games, isLoading } = useCyoaGames()

  return <GameBrowser errorMessage={errorMessage} games={games} loading={isLoading} />
}

export const Head = () => <title>Choose Your Own Adventure | dbowland.com</title>

export default Index
