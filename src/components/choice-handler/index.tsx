import React, { useCallback } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { CyoaOption } from '@types'

export interface ChoiceHandlerProps {
  options: CyoaOption[]
  onChoiceSelect: (optionIndex: number) => void
  disabled: boolean
}

const ChoiceHandler = ({ options, onChoiceSelect, disabled }: ChoiceHandlerProps): React.ReactNode => {
  const handleChoiceClick = useCallback(
    (optionIndex: number) => (): void => {
      onChoiceSelect(optionIndex)
    },
    [onChoiceSelect],
  )

  return (
    <Stack spacing={2}>
      {options.map((option, index) => (
        <Button
          aria-label={`Choose: ${option.name}`}
          disabled={disabled}
          fullWidth
          key={`option-${index}`}
          onClick={handleChoiceClick(index)}
          size="large"
          variant="contained"
        >
          {option.name}
        </Button>
      ))}
    </Stack>
  )
}

export default ChoiceHandler
