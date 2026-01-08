import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { navigate } from 'gatsby'
import React from 'react'

import { mockCyoaGame, mockNarrative } from '../../../test/__mocks__'
import NarrativeDisplay from './index'
import ChoiceHandler from '@components/choice-handler'

jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}))

jest.mock('@components/choice-handler')

describe('NarrativeDisplay component', () => {
  const mockOnChoiceSelect = jest.fn()

  beforeEach(() => {
    jest.mocked(navigate).mockClear()
    mockOnChoiceSelect.mockClear()
    jest.mocked(ChoiceHandler).mockReturnValue(<></>)
  })

  test('expect rendering NarrativeDisplay shows loading state', () => {
    render(<NarrativeDisplay game={null} loading={true} narrative={null} onChoiceSelect={mockOnChoiceSelect} />)

    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  test('expect rendering NarrativeDisplay shows error message', () => {
    const errorMessage = 'Failed to load story'
    render(
      <NarrativeDisplay
        errorMessage={errorMessage}
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay displays game title and narrative content', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    expect(screen.getByText('You find yourself at a crossroads in the forest.')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows current status', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText(/Health/)).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows current inventory', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('sword')).toBeInTheDocument()
    expect(screen.getByText('potion')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows next choice prompt', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('What do you do?')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay passes correct props to ChoiceHandler', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(ChoiceHandler).toHaveBeenCalledWith(
      {
        disabled: false,
        onChoiceSelect: mockOnChoiceSelect,
        options: mockNarrative.options,
      },
      {},
    )
  })

  test('expect clicking Back button navigates to index', async () => {
    const user = userEvent.setup()
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    const backButton = screen.getByText('Back to games list')
    await user.click(backButton)

    expect(navigate).toHaveBeenCalledWith('/')
  })

  test('expect rendering NarrativeDisplay hides inventory section when empty', () => {
    const emptyNarrative = {
      ...mockNarrative,
      inventory: [],
    }

    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={emptyNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByText('Inventory')).not.toBeInTheDocument()
  })
})
