import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import ChoiceHandler from './index'
import { CyoaOption } from '@types'

describe('ChoiceHandler component', () => {
  const mockOptions: CyoaOption[] = [
    { name: 'Go left down the dark corridor' },
    { name: 'Go right toward the light' },
    { name: 'Turn back and retreat' },
  ]

  const mockOnChoiceSelect = jest.fn()

  beforeEach(() => {
    mockOnChoiceSelect.mockClear()
  })

  it('displays all options', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    expect(screen.getByText('Go left down the dark corridor')).toBeInTheDocument()
    expect(screen.getByText('Go right toward the light')).toBeInTheDocument()
    expect(screen.getByText('Turn back and retreat')).toBeInTheDocument()
  })

  it('calls onChoiceSelect with index 0 when first option clicked', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const firstOption = screen.getByText('Go left down the dark corridor')
    await user.click(firstOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(0)
  })

  it('calls onChoiceSelect with index 1 when second option clicked', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const secondOption = screen.getByText('Go right toward the light')
    await user.click(secondOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(1)
  })

  it('calls onChoiceSelect with index 2 when third option clicked', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const thirdOption = screen.getByText('Turn back and retreat')
    await user.click(thirdOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(2)
  })

  it('does not trigger onChoiceSelect when disabled', () => {
    render(<ChoiceHandler disabled={true} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    expect(mockOnChoiceSelect).not.toHaveBeenCalled()
  })

  it('disables buttons when disabled prop is true', () => {
    render(<ChoiceHandler disabled={true} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('enables buttons when disabled prop is false', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled()
    })
  })

  it('renders no buttons when options array is empty', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={[]} />)

    const buttons = screen.queryAllByRole('button')
    expect(buttons).toHaveLength(0)
  })
})
