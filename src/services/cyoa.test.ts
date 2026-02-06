import { mockCyoaGame, mockCyoaGames, mockChoice } from '../../test/__mocks__'
import { fetchCyoaGames, fetchCyoaGame, fetchChoice } from './cyoa'

const mockGet = jest.fn()
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: (...args: any[]) => mockGet(...args),
  })),
}))

describe('cyoa', () => {
  describe('fetchCyoaGames', () => {
    it('fetches CYOA games', async () => {
      mockGet.mockResolvedValueOnce({ data: mockCyoaGames })

      const result = await fetchCyoaGames()

      expect(mockGet).toHaveBeenCalledWith('/games')
      expect(result).toEqual(mockCyoaGames)
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Network error')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchCyoaGames()).rejects.toThrow('Network error')
    })
  })

  describe('fetchCyoaGame', () => {
    it('fetches a specific CYOA game', async () => {
      mockGet.mockResolvedValueOnce({ data: mockCyoaGame })

      const result = await fetchCyoaGame('game-1')

      expect(mockGet).toHaveBeenCalledWith('/games/game-1')
      expect(result).toEqual(mockCyoaGame)
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Game not found')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchCyoaGame('invalid-game')).rejects.toThrow('Game not found')
    })
  })

  describe('fetchChoice', () => {
    it('fetches a choice for a game with 200 status', async () => {
      mockGet.mockResolvedValueOnce({ data: mockChoice, status: 200 })

      const result = await fetchChoice('game-1', 'start')

      expect(mockGet).toHaveBeenCalledWith('/games/game-1/choices/start')
      expect(result).toEqual({ data: mockChoice, isGenerating: false })
    })

    it('returns isGenerating true for 202 status', async () => {
      mockGet.mockResolvedValueOnce({ data: mockChoice, status: 202 })

      const result = await fetchChoice('game-1', 'start')

      expect(mockGet).toHaveBeenCalledWith('/games/game-1/choices/start')
      expect(result).toEqual({ data: mockChoice, isGenerating: true })
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Choice not found')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchChoice('game-1', 'invalid-choice')).rejects.toThrow('Choice not found')
    })
  })
})
