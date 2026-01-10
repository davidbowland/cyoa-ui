/* eslint-disable sort-keys */
import { Theme, CyoaGame, CyoaGameBulk, Narrative } from '@types'

// CYOA Mock Data

export const mockCyoaGame: CyoaGame = {
  description: 'A test adventure',
  initialNarrativeId: 'start',
  lossResourceThreshold: 0,
  resourceName: 'Health',
  resourceImage: 'health-icon.png',
  startingResourceValue: 100,
  title: 'Test Adventure',
}

export const mockCyoaGameBulk: CyoaGameBulk = {
  ...mockCyoaGame,
  gameId: 'test-game-1',
}

export const mockCyoaGames: CyoaGameBulk[] = [
  {
    description: 'A thrilling adventure awaits',
    gameId: 'game-1',
    image: 'https://example.com/image1.jpg',
    initialNarrativeId: 'start',
    lossResourceThreshold: 0,
    resourceName: 'Health',
    resourceImage: 'health-icon.png',
    startingResourceValue: 100,
    title: 'Test Adventure 1',
  },
  {
    description: 'Another exciting journey',
    gameId: 'game-2',
    initialNarrativeId: 'begin',
    lossResourceThreshold: 0,
    resourceName: 'Energy',
    startingResourceValue: 50,
    title: 'Test Adventure 2',
  },
]

export const mockNarrative: Narrative = {
  chapterTitle: 'The Forest Crossroads',
  choice: 'What do you do?',
  currentResourceValue: 100,
  image: 'forest-crossroads.jpg',
  inventory: [
    { image: 'sword.png', name: 'sword' },
    { image: 'potion.png', name: 'potion' },
  ],
  narrative: 'You find yourself at a crossroads in the forest.',
  options: [{ name: 'Go left' }, { name: 'Go right' }],
}

// Themes

export const theme: Theme = {
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    unit: 'px',
  },
  direction: 'ltr',
  components: {},
  palette: {
    mode: 'dark',
    common: { black: '#000', white: '#fff' },
    primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5', contrastText: 'rgba(0, 0, 0, 0.87)' },
    secondary: { main: '#ce93d8', light: '#f3e5f5', dark: '#ab47bc', contrastText: 'rgba(0, 0, 0, 0.87)' },
    error: { main: '#f44336', light: '#e57373', dark: '#d32f2f', contrastText: '#fff' },
    warning: { main: '#ffa726', light: '#ffb74d', dark: '#f57c00', contrastText: 'rgba(0, 0, 0, 0.87)' },
    info: { main: '#29b6f6', light: '#4fc3f7', dark: '#0288d1', contrastText: 'rgba(0, 0, 0, 0.87)' },
    success: { main: '#66bb6a', light: '#81c784', dark: '#388e3c', contrastText: 'rgba(0, 0, 0, 0.87)' },
    grey: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    background: { paper: '#121212', default: '#121212' },
    action: {
      active: '#fff',
      hover: 'rgba(255, 255, 255, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 0.16,
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(255, 255, 255, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
  },
  shape: { borderRadius: 4 },
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width:0px) and (orientation: landscape)': { minHeight: 48 },
      '@media (min-width:600px)': { minHeight: 64 },
    },
  },
} as unknown as Theme
