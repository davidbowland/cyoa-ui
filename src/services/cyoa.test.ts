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
      const mockGames = [
        {
          description: 'A test game',
          gameId: 'game-1',
          initialNarrativeId: 'start',
          resourceName: 'Health',
          title: 'Test Game 1',
        },
      ]
      mockGet.mockResolvedValueOnce({ data: mockGames })

      const result = await fetchCyoaGames()

      expect(mockGet).toHaveBeenCalledWith('/games')
      expect(result).toEqual(mockGames)
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Network error')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchCyoaGames()).rejects.toThrow('Network error')
    })
  })

  describe('fetchCyoaGame', () => {
    it('fetches a specific CYOA game', async () => {
      const mockGame = {
        description: 'A test game',
        initialNarrativeId: 'start',
        resourceName: 'Health',
        title: 'Test Game',
      }
      mockGet.mockResolvedValueOnce({ data: mockGame })

      const result = await fetchCyoaGame('game-1')

      expect(mockGet).toHaveBeenCalledWith('/games/game-1')
      expect(result).toEqual(mockGame)
    })

    it('throws error on failure', async () => {
      const mockError = new Error('Game not found')
      mockGet.mockRejectedValueOnce(mockError)

      await expect(fetchCyoaGame('invalid-game')).rejects.toThrow('Game not found')
    })
  })

  describe('fetchNarrative', () => {
    it('fetches a narrative for a game', async () => {
      const mockNarrative = {
        currentInventory: [],
        currentResourceValue: 100,
        generationStartTime: 1640995200000,
        inventoryOrInformationConsumed: [],
        inventoryToIntroduce: [],
        keyInformationToIntroduce: [],
        lastChoiceMade: 'Started the adventure',
        nextChoice: 'What do you do?',
        options: [{ name: 'Go north' }, { name: 'Go south' }],
        recap: 'You are in a forest',
        redHerringsToIntroduce: [],
      }
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
