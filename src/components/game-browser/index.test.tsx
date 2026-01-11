import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { navigate } from 'gatsby'
import React from 'react'

import { mockCyoaGames } from '../../../test/__mocks__'
import GameBrowser from './index'

jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}))

describe('GameBrowser component', () => {
  it('displays heading', () => {
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    expect(screen.getByText('Choose Your Own Adventure')).toBeInTheDocument()
  })

  it('shows loading skeletons when loading', () => {
    render(<GameBrowser games={[]} loading={true} />)

    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows error message when error provided', () => {
    const errorMessage = 'Failed to load games'
    render(<GameBrowser errorMessage={errorMessage} games={[]} loading={false} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows empty state when no games available', () => {
    render(<GameBrowser games={[]} loading={false} />)

    expect(screen.getByText('No games available at the moment')).toBeInTheDocument()
    expect(screen.getByText('Please check back later for new adventures')).toBeInTheDocument()
  })

  it('displays game list when games provided', () => {
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    expect(screen.getByText('Test Adventure 1')).toBeInTheDocument()
    expect(screen.getByText('A thrilling adventure awaits')).toBeInTheDocument()
    expect(screen.getByText('Test Adventure 2')).toBeInTheDocument()
    expect(screen.getByText('Another exciting journey')).toBeInTheDocument()
  })

  it('navigates to story page when Play button clicked', async () => {
    const user = userEvent.setup()
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    const playButtons = screen.getAllByText('Play')
    await user.click(playButtons[0])

    expect(navigate).toHaveBeenCalledWith('/story/game-1')
  })

  it('navigates to correct story page when second Play button clicked', async () => {
    const user = userEvent.setup()
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    const playButtons = screen.getAllByText('Play')
    // Each game has 2 buttons (mobile + desktop), so second game's first button is at index 2
    await user.click(playButtons[2])

    expect(navigate).toHaveBeenCalledWith('/story/game-2')
  })

  it('displays image when game has image property', () => {
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    const gameImage = screen.getByAltText('Test Adventure 1 cover image')
    expect(gameImage).toBeInTheDocument()
    expect(gameImage).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('displays MenuBook icon when game has no image', () => {
    render(<GameBrowser games={mockCyoaGames} loading={false} />)

    const iconContainer = document.querySelector('[data-testid="MenuBookIcon"]')
    expect(iconContainer).toBeInTheDocument()
  })
})
