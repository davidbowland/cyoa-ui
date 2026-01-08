import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import StoryPage from './[gameId]'
import PrivacyLink from '@components/privacy-link'
import StoryEngine from '@components/story-engine'

jest.mock('@components/privacy-link')
jest.mock('@components/story-engine')

describe('StoryPage', () => {
  beforeEach(() => {
    jest.mocked(PrivacyLink).mockReturnValue(<div>Privacy Link</div>)
    jest.mocked(StoryEngine).mockReturnValue(<div>Story Engine</div>)
  })

  test('expect rendering StoryPage renders StoryEngine with correct gameId', () => {
    render(<StoryPage params={{ gameId: 'test-game-123' }} />)

    expect(StoryEngine).toHaveBeenCalledWith({ gameId: 'test-game-123' }, {})
    expect(screen.getByText('Story Engine')).toBeInTheDocument()
  })

  test('expect rendering StoryPage renders PrivacyLink', () => {
    render(<StoryPage params={{ gameId: 'test-game-123' }} />)

    expect(PrivacyLink).toHaveBeenCalled()
    expect(screen.getByText('Privacy Link')).toBeInTheDocument()
  })

  test('expect rendering StoryPage has correct structure', () => {
    render(<StoryPage params={{ gameId: 'test-game-123' }} />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveStyle({ minHeight: '90vh' })
  })
})
