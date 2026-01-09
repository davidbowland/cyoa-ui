import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import Index, { Head } from './index'
import GameBrowser from '@components/game-browser'
import * as useCyoaGamesHook from '@hooks/useCyoaGames'

jest.mock('@components/game-browser')
jest.mock('@hooks/useCyoaGames')

describe('Index page', () => {
  const mockUseCyoaGames = jest.mocked(useCyoaGamesHook.useCyoaGames)

  beforeAll(() => {
    jest.mocked(GameBrowser).mockReturnValue(<></>)
  })

  it('renders GameBrowser with hook data', () => {
    const mockHookResult = {
      errorMessage: null,
      games: [
        {
          description: 'A test game',
          gameId: 'test-game',
          initialNarrativeId: 'start',
          lossResourceThreshold: 0,
          resourceName: 'Health',
          startingResourceValue: 100,
          title: 'Test Game',
        },
      ],
      isLoading: false,
    }
    mockUseCyoaGames.mockReturnValue(mockHookResult)

    render(<Index />)

    expect(GameBrowser).toHaveBeenCalledWith(
      {
        errorMessage: null,
        games: mockHookResult.games,
        loading: false,
      },
      {},
    )
  })

  it('renders GameBrowser with loading state', () => {
    const mockHookResult = {
      errorMessage: null,
      games: [],
      isLoading: true,
    }
    mockUseCyoaGames.mockReturnValue(mockHookResult)

    render(<Index />)

    expect(GameBrowser).toHaveBeenCalledWith(
      {
        errorMessage: null,
        games: [],
        loading: true,
      },
      {},
    )
  })

  it('renders GameBrowser with error state', () => {
    const mockHookResult = {
      errorMessage: 'Unable to load games',
      games: [],
      isLoading: false,
    }
    mockUseCyoaGames.mockReturnValue(mockHookResult)

    render(<Index />)

    expect(GameBrowser).toHaveBeenCalledWith(
      {
        errorMessage: 'Unable to load games',
        games: [],
        loading: false,
      },
      {},
    )
  })

  it('renders Head with correct title', () => {
    render(<Head />)
    expect(document.title).toEqual('Choose Your Own Adventure | dbowland.com')
  })
})
