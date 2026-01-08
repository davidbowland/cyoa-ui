import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { navigate } from 'gatsby'
import React from 'react'

import GameBrowser from './index'
import { CyoaGameBulk } from '@types'

jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}))

describe('GameBrowser component', () => {
  const mockGames: CyoaGameBulk[] = [
    {
      description: 'A thrilling adventure awaits',
      gameId: 'game-1',
      image: 'https://example.com/image1.jpg',
      initialNarrativeId: 'start',
      resourceName: 'Health',
      title: 'Test Adventure 1',
    },
    {
      description: 'Another exciting journey',
      gameId: 'game-2',
      initialNarrativeId: 'begin',
      resourceName: 'Energy',
      title: 'Test Adventure 2',
    },
  ]

  beforeEach(() => {
    jest.mocked(navigate).mockClear()
  })

  test('expect rendering GameBrowser displays heading', () => {
    render(<GameBrowser games={mockGames} loading={false} />)

    expect(screen.getByText('Choose Your Own Adventure')).toBeInTheDocument()
  })

  test('expect rendering GameBrowser shows loading skeletons when loading', () => {
    render(<GameBrowser games={[]} loading={true} />)

    const skeletons = screen.getAllByRole('status', { name: 'Loading games' })
    expect(skeletons).toHaveLength(1)

    // Check for skeleton elements by class
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  test('expect rendering GameBrowser shows error message when error provided', () => {
    const errorMessage = 'Failed to load games'
    render(<GameBrowser errorMessage={errorMessage} games={[]} loading={false} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('expect rendering GameBrowser shows empty state when no games available', () => {
    render(<GameBrowser games={[]} loading={false} />)

    expect(screen.getByText('No games available at the moment')).toBeInTheDocument()
    expect(screen.getByText('Please check back later for new adventures')).toBeInTheDocument()
  })

  test('expect rendering GameBrowser displays game list when games provided', () => {
    render(<GameBrowser games={mockGames} loading={false} />)

    expect(screen.getByText('Test Adventure 1')).toBeInTheDocument()
    expect(screen.getByText('A thrilling adventure awaits')).toBeInTheDocument()
    expect(screen.getByText('Test Adventure 2')).toBeInTheDocument()
    expect(screen.getByText('Another exciting journey')).toBeInTheDocument()
  })

  test('expect rendering GameBrowser shows image when game has image', () => {
    render(<GameBrowser games={mockGames} loading={false} />)

    const image = screen.getByAltText('Cover image for Test Adventure 1')
    expect(image).toBeInTheDocument()
  })

  test('expect clicking Play Game button navigates to story page', async () => {
    const user = userEvent.setup()
    render(<GameBrowser games={mockGames} loading={false} />)

    const playButtons = screen.getAllByText('Play Game')
    await user.click(playButtons[0])

    expect(navigate).toHaveBeenCalledWith('/story/game-1')
  })

  test('expect clicking second Play Game button navigates to correct story page', async () => {
    const user = userEvent.setup()
    render(<GameBrowser games={mockGames} loading={false} />)

    const playButtons = screen.getAllByText('Play Game')
    await user.click(playButtons[1])

    expect(navigate).toHaveBeenCalledWith('/story/game-2')
  })
})
