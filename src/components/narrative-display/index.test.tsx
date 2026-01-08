import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { navigate } from 'gatsby'
import React from 'react'

import NarrativeDisplay from './index'
import ChoiceHandler from '@components/choice-handler'
import { CyoaGame, Narrative } from '@types'

jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}))

jest.mock('@components/choice-handler')

describe('NarrativeDisplay component', () => {
  const mockGame: CyoaGame = {
    description: 'A test adventure',
    initialNarrativeId: 'start',
    resourceName: 'Health',
    title: 'Test Adventure',
  }

  const mockNarrative: Narrative = {
    currentInventory: ['sword', 'potion'],
    currentResourceValue: 85,
    generationStartTime: 1640995200000,
    inventoryOrInformationConsumed: [],
    inventoryToIntroduce: ['magic ring'],
    keyInformationToIntroduce: ['The door is locked'],
    lastChoiceMade: 'Entered the dungeon',
    nextChoice: 'What do you do next?',
    options: [{ name: 'Attack the goblin' }, { name: 'Try to sneak past' }],
    recap: 'You find yourself in a dark dungeon with a goblin blocking your path.',
    redHerringsToIntroduce: [],
  }

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
        game={mockGame}
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
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    expect(
      screen.getByText('You find yourself in a dark dungeon with a goblin blocking your path.'),
    ).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows current status', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText(/Health/)).toBeInTheDocument()
    expect(screen.getByText(/85/)).toBeInTheDocument()
    expect(screen.getByText(/Last Choice/)).toBeInTheDocument()
    expect(screen.getByText(/Entered the dungeon/)).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows current inventory', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('sword')).toBeInTheDocument()
    expect(screen.getByText('potion')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows new items', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('New Items')).toBeInTheDocument()
    expect(screen.getByText('magic ring')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows key information', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('Key Information')).toBeInTheDocument()
    expect(screen.getByText('The door is locked')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows next choice prompt', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.getByText('What do you do next?')).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay passes correct props to ChoiceHandler', () => {
    render(
      <NarrativeDisplay
        game={mockGame}
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
        game={mockGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    const backButton = screen.getByText('← Back to Games')
    await user.click(backButton)

    expect(navigate).toHaveBeenCalledWith('/')
  })

  test('expect rendering NarrativeDisplay hides sections when data is empty', () => {
    const emptyNarrative: Narrative = {
      ...mockNarrative,
      currentInventory: [],
      inventoryToIntroduce: [],
      keyInformationToIntroduce: [],
      lastChoiceMade: '',
    }

    render(
      <NarrativeDisplay
        game={mockGame}
        loading={false}
        narrative={emptyNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByText('Inventory')).not.toBeInTheDocument()
    expect(screen.queryByText('New Items')).not.toBeInTheDocument()
    expect(screen.queryByText('Key Information')).not.toBeInTheDocument()
    expect(screen.queryByText('Last Choice:')).not.toBeInTheDocument()
  })
})
