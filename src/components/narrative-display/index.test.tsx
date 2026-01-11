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
  const mockScrollIntoView = jest.fn()

  beforeAll(() => {
    jest.mocked(ChoiceHandler).mockReturnValue(<>ChoiceHandler</>)

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: mockScrollIntoView,
    })
  })

  it('renders loading state', () => {
    render(<NarrativeDisplay game={null} loading={true} narrative={null} onChoiceSelect={mockOnChoiceSelect} />)

    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows error message', () => {
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

  it('displays game title and narrative content', () => {
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

  it('shows current status', () => {
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

  it('shows current inventory', () => {
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

  it('shows next choice prompt', () => {
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

  it('passes correct props to ChoiceHandler', () => {
    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(ChoiceHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
        options: mockNarrative.options,
      }),
      {},
    )
  })

  it('scrolls to narrative area and calls onChoiceSelect when choice is made', () => {
    const mockMakeSelection = jest.fn()
    jest.mocked(ChoiceHandler).mockImplementation(({ onChoiceSelect }) => {
      mockMakeSelection.mockImplementation(onChoiceSelect)
      return <>ChoiceHandler</>
    })

    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={mockNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    mockMakeSelection(1)

    expect(mockScrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('navigates to index when Back button clicked', async () => {
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

  it('hides inventory section when empty', () => {
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

  it('hides decision section when no choice', () => {
    const emptyNarrative = {
      ...mockNarrative,
      choice: undefined,
    }

    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={emptyNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByText('Decision')).not.toBeInTheDocument()
  })

  it('hides decision section when no options', () => {
    const emptyNarrative = {
      ...mockNarrative,
      options: [],
    }

    render(
      <NarrativeDisplay
        game={mockCyoaGame}
        loading={false}
        narrative={emptyNarrative}
        onChoiceSelect={mockOnChoiceSelect}
      />,
    )

    expect(screen.queryByText('Decision')).not.toBeInTheDocument()
  })

  it('shows resource value with starting value when current is less than starting', () => {
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
      screen.getByText((_, element) => {
        return (
          element?.tagName === 'DIV' &&
          element?.className.includes('MuiTypography-root') &&
          element?.textContent === 'Health: 75 / 100'
        )
      }),
    ).toBeInTheDocument()
  })

  it('shows resource value with loss threshold when current equals or exceeds starting', () => {
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
      screen.getByText((_, element) => {
        return (
          element?.tagName === 'DIV' &&
          element?.className.includes('MuiTypography-root') &&
          element?.textContent === 'Health: 120 / 10'
        )
      }),
    ).toBeInTheDocument()
  })

  it('displays narrative image when available', () => {
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

  it('hides narrative image when not available', () => {
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

  it('displays resource image when available', () => {
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

  it('hides resource image when not available', () => {
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
