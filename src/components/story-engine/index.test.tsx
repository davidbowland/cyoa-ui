import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { mockCyoaGame, mockChoice } from '../../../test/__mocks__'
import StoryEngine from './index'
import ChoiceDisplay from '@components/choice-display'
import { fetchCyoaGame, fetchChoice } from '@services/cyoa'

jest.mock('@components/choice-display')
jest.mock('@services/cyoa')

describe('StoryEngine component', () => {
  const mockNextChoice = {
    ...mockChoice,
    choice: 'What do you do with the chest?',
    narrative: 'You went left and found a treasure chest.',
    options: [{ name: 'Open it' }, { name: 'Leave it' }],
  }

  beforeAll(() => {
    jest.mocked(ChoiceDisplay).mockReturnValue(<>ChoiceDisplay</>)
    console.error = jest.fn()
  })

  it('loads initial game and choice', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockCyoaGame)
    jest.mocked(fetchChoice).mockResolvedValueOnce({ data: mockChoice, isGenerating: false })

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(fetchCyoaGame).toHaveBeenCalledWith('test-game')
      expect(fetchChoice).toHaveBeenCalledWith('test-game', 'start')
    })

    expect(ChoiceDisplay).toHaveBeenCalledWith(
      {
        choice: mockChoice,
        errorMessage: null,
        game: mockCyoaGame,
        loading: false,
        onChoiceSelect: expect.any(Function),
      },
      {},
    )
  })

  it('shows loading state initially', () => {
    jest.mocked(fetchCyoaGame).mockImplementation(() => new Promise(() => {}))
    jest.mocked(fetchChoice).mockImplementation(() => new Promise(() => {}))

    render(<StoryEngine gameId="test-game" />)

    expect(ChoiceDisplay).toHaveBeenCalledWith(
      {
        choice: null,
        errorMessage: null,
        game: null,
        loading: true,
        onChoiceSelect: expect.any(Function),
      },
      {},
    )
  })

  it('handles game loading error', async () => {
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

  it('handles choice loading error', async () => {
    const error = new Error('Failed to load choice')
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockCyoaGame)
    jest.mocked(fetchChoice).mockRejectedValueOnce(error)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('pollForChoice', { error })
    })

    expect(ChoiceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        choice: null,
        errorMessage: 'Failed to load next story segment. Please try again.',
        game: mockCyoaGame,
        loading: false,
      }),
      {},
    )
  })

  it('loads next choice when choice selected', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockCyoaGame)
    jest
      .mocked(fetchChoice)
      .mockResolvedValueOnce({ data: mockChoice, isGenerating: false })
      .mockResolvedValueOnce({ data: mockNextChoice, isGenerating: false })

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(ChoiceDisplay).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: mockChoice,
          game: mockCyoaGame,
          loading: false,
        }),
        {},
      )
    })

    const lastCall = jest.mocked(ChoiceDisplay).mock.calls[jest.mocked(ChoiceDisplay).mock.calls.length - 1]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    onChoiceSelect(0)

    await waitFor(() => {
      expect(fetchChoice).toHaveBeenCalledWith('test-game', 'start-0')
    })

    expect(ChoiceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        choice: mockNextChoice,
        game: mockCyoaGame,
        loading: false,
      }),
      {},
    )
  })

  it('handles choice selection error', async () => {
    const error = new Error('Failed to load next choice')
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockCyoaGame)
    jest
      .mocked(fetchChoice)
      .mockResolvedValueOnce({ data: mockChoice, isGenerating: false })
      .mockRejectedValueOnce(error)

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(ChoiceDisplay).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: false,
        }),
        {},
      )
    })

    const lastCall = jest.mocked(ChoiceDisplay).mock.calls[jest.mocked(ChoiceDisplay).mock.calls.length - 1]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    onChoiceSelect(1)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('pollForChoice', { error })
    })

    expect(ChoiceDisplay).toHaveBeenCalledWith(
      expect.objectContaining({
        choice: mockChoice,
        errorMessage: 'Failed to load next story segment. Please try again.',
        game: mockCyoaGame,
        loading: false,
      }),
      {},
    )
  })

  it('reloads initial game when retry clicked and no current game', async () => {
    const error = new Error('Failed to load game')
    jest.mocked(fetchCyoaGame).mockRejectedValueOnce(error).mockResolvedValueOnce(mockCyoaGame)
    jest.mocked(fetchChoice).mockResolvedValueOnce({ data: mockChoice, isGenerating: false })

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

  it('does nothing when choice selected but no current choice', async () => {
    jest.mocked(fetchCyoaGame).mockResolvedValueOnce(mockCyoaGame)
    jest.mocked(fetchChoice).mockResolvedValueOnce({ data: mockChoice, isGenerating: false })

    render(<StoryEngine gameId="test-game" />)

    await waitFor(() => {
      expect(fetchChoice).toHaveBeenCalledTimes(1)
    })

    const lastCall = jest.mocked(ChoiceDisplay).mock.calls[0]
    const onChoiceSelect = lastCall[0].onChoiceSelect

    onChoiceSelect(0)

    expect(fetchChoice).toHaveBeenCalledTimes(1)
  })
})
