import { renderHook, waitFor } from '@testing-library/react'

import { useCyoaGames } from './useCyoaGames'
import * as cyoa from '@services/cyoa'

jest.mock('@services/cyoa')

describe('useCyoaGames', () => {
  const mockGames = [
    {
      description: 'A test adventure',
      gameId: 'test-game-1',
      initialNarrativeId: 'start',
      resourceName: 'Health',
      title: 'Test Adventure 1',
    },
    {
      description: 'Another test adventure',
      gameId: 'test-game-2',
      image: 'test-image.jpg',
      initialNarrativeId: 'beginning',
      resourceName: 'Energy',
      title: 'Test Adventure 2',
    },
  ]

  beforeAll(() => {
    jest.mocked(cyoa).fetchCyoaGames.mockResolvedValue(mockGames)

    console.error = jest.fn()
  })

  it('returns games from API', async () => {
    const { result } = renderHook(() => useCyoaGames())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.games).toEqual(mockGames)
    expect(result.current.errorMessage).toBeNull()
  })

  it('handles API errors', async () => {
    jest.mocked(cyoa).fetchCyoaGames.mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(() => useCyoaGames())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Unable to load games')
    })

    expect(result.current.games).toEqual([])
  })
})
