import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import StoryEngine from './index'
import NarrativeDisplay from '@components/narrative-display'
import { fetchCyoaGame, fetchNarrative } from '@services/cyoa'
import { CyoaGame, Narrative } from '@types'

jest.mock('@components/narrative-display')
jest.mock('@services/cyoa')

describe('StoryEngine component', () => {
  const mockGame: CyoaGame = {
    description: 'A test adventure',
    initialNarrativeId: 'start',
    resourceName: 'Health',
    title: 'Test Adventure',
  }

  const mockNarrative: Narrative = {
    currentInventory: ['sword'],
    currentResourceValue: 100,
    generationStartTime: 1640995200000,
    inventoryOrInformationConsumed: [],
    inventoryToIntroduce: [],
    keyInformationToIntroduce: [],
    lastChoiceMade: '',
    nextChoice: 'What do you do?',
    options: [{ name: 'Go left' }, { name: 'Go right' }],
    recap: 'You are at a crossroads.',
    redHerringsToIntroduce: [],
  }

  const mockNextNarrative: Narrative = {
    ...mockNarrative,
    lastChoiceMade: 'Go left',
    recap: 'You went left and found a treasure chest.',
  }

  beforeEach(() => {
    jest.mocked(fetchCyoaGame).mockClear()
    jest.mocked(fetchNarrative).mockClear()
    jest.mocked(NarrativeDisplay).mockReturnValue(<></>)
    console.error = jest.fn()
  })

  test('expect rendering StoryEngine loads initial game and narrative', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockResolvedValueOnce(mockNarrative)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(fetchCyoaGame).toHaveBeenCalledWith('test-game')
      expect(fetchNarrative).toHaveBeenCalledWith('test-game', 'start')
    })

    expect(NarrativeDisplay).toHaveBeenCalledWith(
      {
        errorMessage: null,
        game: mockGame,
        loading: false,
        narrative: mockNarrative,
        onChoiceSelect: expect.any(Function),
      },
      {},
    )
  })

  test('expect rendering StoryEngine shows loading state initially', () => {
    jest.mocked(fetchCyoaGame).mockImplementation(() => new Promise(() => {}))
    jest.mocked(fetchNarrative).mockImplementation(() => new Promise(() => {}))

    render(<StoryEngine gameId="test-game" />)

    expect(NarrativeDisplay).toHaveBeenCalledWith(
      {
        errorMessage: null,
        game: null,
        loading: true,
        narrative: null,
        onChoiceSelect: expect.any(Function),
      },
      {},
    )
  })

  test('expect rendering StoryEngine handles game loading error', async () => {
    const error = new Error('Failed to load game')
    jest.mocked(fetchCyoaGame).mockRejectedValueOnce(error)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('loadInitialGame', { error })
    })

    expect(screen.getByText('Failed to load game. Please refresh the page to try again.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  test('expect rendering StoryEngine handles narrative loading error', async () => {
    const error = new Error('Failed to load narrative')
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockRejectedValueOnce(error)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('loadInitialGame', { error })
    })

    // When narrative loading fails, currentGame is reset and error UI is shown
    expect(screen.getByText('Failed to load game. Please refresh the page to try again.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('expect choice selection loads next narrative', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockResolvedValueOnce(mockNarrative).mockResolvedValueOnce(mockNextNarrative)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(NarrativeDisplay).toHaveBeenCalledWith(
        expect.objectContaining({
          game: mockGame,
          loading: false,
          narrative: mockNarrative,
        }),
        {},
      )
    })

    const lastCall = jest.mocked(NarrativeDisplay).mock.calls[jest.mocked(NarrativeDisplay).mock.calls.length - 1]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    await onChoiceSelect(0)

    await waitFor(() => {
      expect(fetchNarrative).toHaveBeenCalledWith('test-game', 'start-0')
    })

    expect(NarrativeDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        game: mockGame,
        loading: false,
        narrative: mockNextNarrative,
      }),
      {},
    )
  })

  test('expect choice selection handles error', async () => {
    const error = new Error('Failed to load next narrative')
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockResolvedValueOnce(mockNarrative).mockRejectedValueOnce(error)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(NarrativeDisplay).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: false,
        }),
        {},
      )
    })

    const lastCall = jest.mocked(NarrativeDisplay).mock.calls[jest.mocked(NarrativeDisplay).mock.calls.length - 1]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    await onChoiceSelect(1)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('handleChoiceSelect', { error })
    })

    expect(NarrativeDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMessage: 'Failed to load next story segment. Please try again.',
        game: mockGame,
        loading: false,
        narrative: mockNarrative,
      }),
      {},
    )
  })

  test('expect retry button reloads initial game when no current game', async () => {
    const error = new Error('Failed to load game')
    jest.mocked(fetchCyoaGame).mockRejectedValueOnce(error).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockResolvedValueOnce(mockNarrative)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })

    const user = userEvent.setup()
    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)

    await waitFor(() => {
      expect(fetchCyoaGame).toHaveBeenCalledTimes(2)
    })
  })

  test('expect choice selection does nothing when no current narrative', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockGame)
    jest.mocked(fetchNarrative).mockResolvedValueOnce(mockNarrative)

    render(<StoryEngine gameId="test-game" />)

    const lastCall = jest.mocked(NarrativeDisplay).mock.calls[0]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    await onChoiceSelect(0)

    expect(fetchNarrative).toHaveBeenCalledTimes(1)
  })
})
