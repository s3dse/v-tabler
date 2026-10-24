import { describe, expect, it } from 'vitest'
import { theme } from '../theme.js'

const STATUS_COLORS = {
  light: {
    warning: {
      DEFAULT: '#92400e',
      bg: '#fffbeb',
      border: '#f59e0b',
      hover: '#fef3c7'
    },
    success: {
      DEFAULT: '#166534',
      bg: '#f0fdf4',
      border: '#22c55e',
      hover: '#dcfce7'
    }
  },
  dark: {
    warning: {
      DEFAULT: '#fcd34d',
      bg: '#451a03',
      border: '#f59e0b',
      hover: '#78350f'
    },
    success: {
      DEFAULT: '#86efac',
      bg: '#052e16',
      border: '#22c55e',
      hover: '#14532d'
    }
  }
}

describe('semantic status colors', () => {
  it.each(['light', 'dark'])('defines warning and success colors for %s mode', (mode) => {
    expect(theme[mode].colors).toMatchObject(STATUS_COLORS[mode])
  })
})
