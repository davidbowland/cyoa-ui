import { renderHook, waitFor } from '@testing-library/react'

import { mockCyoaGames } from '../../test/__mocks__'
import { useCyoaGames } from './useCyoaGames'
import * as cyoa from '@services/cyoa'

jest.mock('@services/cyoa')

describe('useCyoaGames', () => {
  beforeAll(() => {
    jest.mocked(cyoa).fetchCyoaGames.mockResolvedValue(mockCyoaGames)

    console.error = jest.fn()
  })

  it('returns games from API', async () => {
    const { result } = renderHook(() => useCyoaGames())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.games).toEqual(mockCyoaGames)
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
