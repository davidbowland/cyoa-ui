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

  test('expect rendering InventoryDisplay shows inventory items', () => {
    render(<InventoryDisplay items={mockInventoryItems} />)

    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('sword')).toBeInTheDocument()
    expect(screen.getByText('potion')).toBeInTheDocument()
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  test('expect rendering InventoryDisplay shows images when available', () => {
    render(<InventoryDisplay items={mockInventoryItems} />)

    const swordImage = screen.getByAltText('sword')
    expect(swordImage).toBeInTheDocument()
    expect(swordImage).toHaveAttribute('src', 'images/sword.png')

    const potionImage = screen.getByAltText('potion')
    expect(potionImage).toBeInTheDocument()
    expect(potionImage).toHaveAttribute('src', 'images/potion.png')
  })

  test('expect rendering InventoryDisplay handles items without images', () => {
    const itemsWithoutImages: InventoryItem[] = [{ name: 'key' }, { name: 'note' }]

    render(<InventoryDisplay items={itemsWithoutImages} />)

    expect(screen.getByText('key')).toBeInTheDocument()
    expect(screen.getByText('note')).toBeInTheDocument()

    // Should not have any images
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('expect rendering InventoryDisplay returns null when no items', () => {
    const { container } = render(<InventoryDisplay items={[]} />)

    expect(container.firstChild).toBeNull()
  })
})
