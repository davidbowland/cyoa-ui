import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import InventoryDisplay from './index'
import { InventoryItem } from '@types'

describe('InventoryDisplay component', () => {
  const mockInventoryItems: InventoryItem[] = [
    { image: 'sword.png', name: 'sword' },
    { image: 'potion.png', name: 'potion' },
    { name: 'key' },
  ]

  it('shows inventory items', () => {
    render(<InventoryDisplay items={mockInventoryItems} />)

    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('sword')).toBeInTheDocument()
    expect(screen.getByText('potion')).toBeInTheDocument()
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('shows images when available', () => {
    render(<InventoryDisplay items={mockInventoryItems} />)

    const swordImage = screen.getByAltText('sword')
    expect(swordImage).toBeInTheDocument()
    expect(swordImage).toHaveAttribute('src', 'sword.png')

    const potionImage = screen.getByAltText('potion')
    expect(potionImage).toBeInTheDocument()
    expect(potionImage).toHaveAttribute('src', 'potion.png')
  })

  it('handles items without images', () => {
    const itemsWithoutImages: InventoryItem[] = [{ name: 'key' }, { name: 'note' }]

    render(<InventoryDisplay items={itemsWithoutImages} />)

    expect(screen.getByText('key')).toBeInTheDocument()
    expect(screen.getByText('note')).toBeInTheDocument()

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('returns null when no items', () => {
    const { container } = render(<InventoryDisplay items={[]} />)

    expect(container.firstChild).toBeNull()
  })
})
