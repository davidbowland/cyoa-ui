# Steering for cyoa-ui

## Description

This is a Gatsby project for a Choose Your Own Adventure interactive storytelling game with cyoa-api on the back end. The application provides a game browser for selecting adventures and a story interface for narrative progression through user choices.

## Technology Stack

- **Gatsby** - Static site generator and React framework
- **React** - UI library with functional components and hooks
- **Material-UI (@mui/material)** - Primary component library for consistent UI
- **Styled Components** - CSS-in-JS styling (prefer MUI components)
- **TypeScript** - Type safety with explicit interfaces
- **Jest & React Testing Library** - Testing framework
- **Axios** - HTTP client for CYOA API communication

## Code Layout

### src/assets

- Static files like images, CSS, and PDF documents

### src/components

- React components for CYOA functionality
- Each component has an index.tsx but can have multiple supporting files
- Each component has ONE index.test.tsx that tests ALL files for that component
- ALWAYS think about component domain (BAD: Pass raw API data to UI component, GOOD: Pass processed/formatted data to UI component)

### src/hooks

- Custom React hooks for data fetching and state management
- Follow existing patterns for error handling and loading states

### src/services

- API service layer for CYOA backend communication
- Uses axios with 35-second timeout and environment-based base URL

### src/pages

- The pages served directly by this UI
- Pages are bare-bones, as they import components

### src/types.ts

- TypeScript interfaces for CYOA domain objects
- Use explicit type aliases rather than strings (GameId, NarrativeId)

### src/environment.d.ts

- Defines available environment variable types
- See .env.development or .env.production for values

### template.yaml

- Infrastructure for hosting the static site on AWS
- Uses S3 for storage, CloudFront for CDN, and Route53 for DNS

### .github/workflows/pipeline.yaml

- Definition of the GitHub Actions deployment script for this repository

## Rules for Development

- ALWAYS analyze existing patterns in the file and repository and follow them EXACTLY
- Use functional programming, when possible
- Use arrow functions
- ALWAYS use functional components with React hooks
- **All exported functions / components must specify explicit types for all inputs and return values**
- Imports from within the repository should use paths defined in tsconfig.json (like `@components/`, `@services/`, `@types`)
- When finished with changes, ALWAYS `npm run test` and ensure tests are passing with adequate coverage
- Use comments to explain WHY rather than WHAT, and use them sparingly

### Type Safety Requirements

```typescript
// All exported functions must have explicit types for parameters and return values:
export const formatNarrativeId = (baseId: NarrativeId, optionIndex: number): NarrativeId => {
  return `${baseId}-${optionIndex}`
}

// Component props must use explicit interfaces:
export interface StoryEngineProps {
  gameId: GameId
}

// Hook return types must be explicit:
export interface UseCyoaGamesResult {
  games: CyoaGameBulk[]
  isLoading: boolean
  errorMessage: string | null
}
```

### Logging Standards

ALL unexpected exceptions should be logged with console.error. Tests should set `console.error = jest.fn()` to silence those expected errors during testing.

### Error Handling Patterns

CYOA components follow consistent error handling patterns:

```typescript
// Service methods let errors bubble up - no try/catch in services:
export const fetchCyoaGame = async (gameId: GameId): Promise<CyoaGame> => {
  const response = await api.get(`/games/${gameId}`)
  return response.data
}

// Components handle errors with logging and user-friendly messages:
export const StoryEngine: React.FC<StoryEngineProps> = ({ gameId }) => {
  const [error, setError] = useState<string | null>(null)

  const loadGame = useCallback(async (): Promise<void> => {
    try {
      setError(null)
      const game = await fetchCyoaGame(gameId)
      // Handle success
    } catch (error: unknown) {
      console.error('loadGame', { error })
      setError('Failed to load game. Please refresh the page to try again.')
    }
  }, [gameId])
}

// Error display using MUI Alert components:
{errorMessage && (
  <Alert aria-live="polite" role="alert" severity="error">
    {errorMessage}
  </Alert>
)}
```

### Loading State Patterns

```typescript
// Use MUI Skeleton components for loading states:
{loading ? (
  <Skeleton height={40} variant="text" width="60%" />
) : (
  <Typography variant="h4">{game.title}</Typography>
)}

// Loading states match the shape of expected content:
<Grid container spacing={3}>
  {Array.from({ length: 6 }).map((_, index) => (
    <Grid item key={`skeleton-${index}`} md={4} sm={6} xs={12}>
      <Card>
        <Skeleton height={200} variant="rectangular" />
        <CardContent>
          <Skeleton height={32} variant="text" />
          <Skeleton height={20} variant="text" />
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

## Rules for Testing

- ALWAYS analyze existing patterns in the file and repository and follow them EXACTLY
- **ALL TESTS MUST BE DETERMINISTIC** (no randomness, conditionals, or time-dependent values)
- ALWAYS test user-facing functionality (BAD: expect this object to have certain CSS, BAD: expect this object to be disabled, GOOD: try to click on this object and expect no service call, GOOD: is the expected text visible)
- Use comments to explain WHY rather than WHAT, and use them sparingly
- Jest is configured to clear mocks after each test -- NEVER CALL jest.clearAllMocks()
- NEVER use beforeEach or afterEach -- use shared setup/teardown functions defined within the test and invoke them in each test
- EXCLUSIVELY use `mock...Once` in tests and `mock...` (without Once) in beforeAll
- Use jest.mocked for type-safe mocking
- Use UserEvent for interacting with the DOM, when possible
- NEVER use jest.spyOn
- Every exported function should be tested on its own with its own describe block

### CYOA-Specific Testing Patterns

#### Service Testing

```typescript
// Mock axios create pattern for service tests:
const mockGet = jest.fn()
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: (...args: any[]) => mockGet(...args),
  })),
}))

// Test both success and error scenarios:
describe('fetchCyoaGame', () => {
  it('fetches a specific CYOA game', async () => {
    const mockGame = {
      description: 'A test game',
      initialNarrativeId: 'start',
      resourceName: 'Health',
      title: 'Test Game',
    }
    mockGet.mockResolvedValueOnce({ data: mockGame })

    const result = await fetchCyoaGame('game-1')

    expect(mockGet).toHaveBeenCalledWith('/games/game-1')
    expect(result).toEqual(mockGame)
  })
})
```

#### Component Testing

```typescript
// Mock child components in parent component tests:
jest.mock('@components/narrative-display')

beforeAll(() => {
  jest.mocked(NarrativeDisplay).mockReturnValue(<></>)
})

// Test component interactions through props:
test('expect choice selection loads next narrative', async () => {
  // Setup mocks and render component

  const lastCall = jest.mocked(NarrativeDisplay).mock.calls[jest.mocked(NarrativeDisplay).mock.calls.length - 1]
  const onChoiceSelect = lastCall[0].onChoiceSelect

  await onChoiceSelect(0)

  expect(fetchNarrative).toHaveBeenCalledWith('test-game', 'start-0')
})
```

#### Hook Testing

```typescript
// Use renderHook for custom hook testing:
import { renderHook, waitFor } from '@testing-library/react'

test('returns games from API', async () => {
  const { result } = renderHook(() => useCyoaGames())

  expect(result.current.isLoading).toBe(true)

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })

  expect(result.current.games).toEqual(mockGames)
})
```

### Deterministic Testing Requirements

```typescript
// BAD - Non-deterministic:
const timestamp = Date.now()
const randomId = Math.random().toString()
const conditionalValue = Math.random() > 0.5 ? 'a' : 'b'

// GOOD - Deterministic:
const fixedTimestamp = 1640995200000 // Use fixed values
const testGameId = 'test-game-123'
const expectedNarrativeId = 'start-0' // Use consistent test data
```

### Component Mocking Patterns

For mocking components in tests:

```typescript
import GameBrowser from '@components/game-browser'

jest.mock('@components/game-browser')

beforeAll(() => {
  jest.mocked(GameBrowser).mockReturnValue(<></>)
})
```

For mocking services in tests:

```typescript
import * as cyoa from '@services/cyoa'

jest.mock('@services/cyoa')

beforeAll(() => {
  jest.mocked(cyoa).fetchCyoaGames.mockResolvedValue(mockGames)
})
```

For testing with timers:

```typescript
const mockDate = new Date('2025-12-30T12:00:00Z')

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(mockDate)
})

afterAll(() => {
  jest.useRealTimers()
})
```
