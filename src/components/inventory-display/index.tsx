import React from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { InventoryItem } from '@types'

export interface InventoryDisplayProps {
  items: InventoryItem[]
}

const InventoryDisplay = ({ items }: InventoryDisplayProps): React.ReactNode => {
  if (items.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography component="h3" gutterBottom variant="h6">
        Inventory
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item key={`inventory-${index}`} md={3} sm={4} xs={6}>
            <Card sx={{ height: '100%' }}>
              {item.image && (
                <CardMedia
                  alt={item.name}
                  component="img"
                  height="120"
                  image={item.image}
                  sx={{ objectFit: 'contain' }}
                />
              )}
              <CardContent sx={{ py: 1, textAlign: 'center' }}>
                <Typography component="h4" variant="body2">
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default InventoryDisplay
