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

  test('expect rendering ChoiceHandler displays all options', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    expect(screen.getByText('Go left down the dark corridor')).toBeInTheDocument()
    expect(screen.getByText('Go right toward the light')).toBeInTheDocument()
    expect(screen.getByText('Turn back and retreat')).toBeInTheDocument()
  })

  test('expect clicking first option calls onChoiceSelect with index 0', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const firstOption = screen.getByText('Go left down the dark corridor')
    await user.click(firstOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(0)
  })

  test('expect clicking second option calls onChoiceSelect with index 1', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const secondOption = screen.getByText('Go right toward the light')
    await user.click(secondOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(1)
  })

  test('expect clicking third option calls onChoiceSelect with index 2', async () => {
    const user = userEvent.setup()
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const thirdOption = screen.getByText('Turn back and retreat')
    await user.click(thirdOption)

    expect(mockOnChoiceSelect).toHaveBeenCalledWith(2)
  })

  test('expect disabled buttons do not trigger onChoiceSelect', () => {
    render(<ChoiceHandler disabled={true} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    expect(mockOnChoiceSelect).not.toHaveBeenCalled()
  })

  test('expect buttons are disabled when disabled prop is true', () => {
    render(<ChoiceHandler disabled={true} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  test('expect buttons are enabled when disabled prop is false', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={mockOptions} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled()
    })
  })

  test('expect empty options array renders no buttons', () => {
    render(<ChoiceHandler disabled={false} onChoiceSelect={mockOnChoiceSelect} options={[]} />)

    const buttons = screen.queryAllByRole('button')
    expect(buttons).toHaveLength(0)
  })
})
