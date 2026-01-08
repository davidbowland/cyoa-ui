import { mockCyoaGame, mockCyoaGames, mockNarrative } from '../../test/__mocks__'
import { fetchCyoaGames, fetchCyoaGame, fetchNarrative } from './cyoa'

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

  describe('fetchNarrative', () => {
    it('fetches a narrative for a game', async () => {
      mockGet.mockResolvedValueOnce({ data: mockNarrative })

      const result = await fetchNarrative('game-1', 'start')

      expect(mockGet).toHaveBeenCalledWith('/games/game-1/narratives/start')
      expect(result).toEqual(mockNarrative)
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Narrative not found')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchNarrative('game-1', 'invalid-narrative')).rejects.toThrow('Narrative not found')
    })
  })
})
