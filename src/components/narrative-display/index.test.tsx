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

  test('expect rendering NarrativeDisplay shows resource value with starting value when current is less than starting', () => {
    const gameWithLowerResource = {
      ...mockCyoaGame,
      lossResourceThreshold: 10,
      startingResourceValue: 100,
    }
    const narrativeWithLowerResource = {
      ...mockNarrative,
      currentResourceValue: 75,
    }

    render(
      <NarrativeDisplay
        game={gameWithLowerResource}
        loading={false}
        narrative={narrativeWithLowerResource}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName === 'DIV' &&
          element?.className.includes('MuiTypography-root') &&
          element?.textContent === 'Health: 75 / 100'
        )
      }),
    ).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay shows resource value with loss threshold when current equals or exceeds starting', () => {
    const gameWithHigherResource = {
      ...mockCyoaGame,
      lossResourceThreshold: 10,
      startingResourceValue: 100,
    }
    const narrativeWithHigherResource = {
      ...mockNarrative,
      currentResourceValue: 120,
    }

    render(
      <NarrativeDisplay
        game={gameWithHigherResource}
        loading={false}
        narrative={narrativeWithHigherResource}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName === 'DIV' &&
          element?.className.includes('MuiTypography-root') &&
          element?.textContent === 'Health: 120 / 10'
        )
      }),
    ).toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay displays narrative image when available', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    const narrativeImage = screen.getByAltText('The Forest Crossroads')
    expect(narrativeImage).toBeInTheDocument()
    expect(narrativeImage).toHaveAttribute('src', 'forest-crossroads.jpg')
  })

  test('expect rendering NarrativeDisplay hides narrative image when not available', () => {
    const narrativeWithoutImage = {
      ...mockNarrative,
      image: undefined,
    }

    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={narrativeWithoutImage}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByAltText('The Forest Crossroads')).not.toBeInTheDocument()
  })

  test('expect rendering NarrativeDisplay displays resource image when available', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    const resourceImage = screen.getByAltText('Health')
    expect(resourceImage).toBeInTheDocument()
    expect(resourceImage).toHaveAttribute('src', 'health-icon.png')
  })

  test('expect rendering NarrativeDisplay hides resource image when not available', () => {
    const gameWithoutResourceImage = {
      ...mockCyoaGame,
      resourceImage: undefined,
    }

    render(
      <NarrativeDisplay
        game={gameWithoutResourceImage}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByAltText('Health')).not.toBeInTheDocument()
  })
})
