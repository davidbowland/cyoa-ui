# Steering for cyoa-ui

## Description

This is a Gatsby project for a choose-you-own-adventure style game with cyoa-api on the back end.

## Technology Stack

- **Gatsby** - Static site generator and React framework
- **React** - UI library with functional components
- **Material-UI (@mui/material)** - Primary component library
- **Styled Components** - CSS-in-JS styling
- **TypeScript** - Type safety
- **Jest & React Testing Library** - Testing framework

## Code Layout

### src/assets

- Static files like images, CSS, and PDF documents (resume)

### src/components

- React components
- Each component has an index.tsx but can have multiple supporting files
- Each component has ONE index.test.tsx that tests ALL files for that component
- ALWAYS think about component domain (BAD: Provide score to pass/fail component, GOOD: Provide isPass={score > 80} to pass/fail component)

### src/config

- Configuration files, primarily URL constants

### src/pages

- The pages served directly by this UI
- Pages are bare-bones, as they import components

### src/environment.d.ts

- Defines available environment variable types
- See .env.development or .env.production for values

### template.yaml

- Infrastructure for hosting the static site on AWS
- Uses S3 for storage, CloudFront for CDN, and Route53 for DNS
- Includes both main domain and www redirect configuration

### .github/workflows/pipeline.yaml

- Definition of the GitHub Actions deployment script for this repository

## Rules for Development

- ALWAYS analyze existing patterns in the file and repository and follow them EXACTLY
- Use functional programming, when possible
- Use arrow functions
- ALWAYS use functional components
- **All exported functions / components must specify explicit types for all inputs and return values**
- Imports from within the repository should use paths defined in tsconfig.json (like `@components/`)
- When finished with changes, ALWAYS `npm run test` and ensure tests are passing with adequate coverage
- Use comments to explain WHY rather than WHAT, and use them sparingly

### Type Safety Requirements

```typescript
// All exported functions must have explicit types for parameters and return values:
export const formatDate = (date: Date): string => {
  // Implementation
}
```

### Logging Standards

ALL unexpected exceptions should be logged with console.error. Tests should set `console.error = jest.fn()` to silence those expected errors during testing.

### Error Handling Patterns

```typescript
// Frontend components should handle errors gracefully:
export const Component: React.FC<ComponentProps> = ({ data }) => {
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (): Promise<void> => {
    try {
      // Component logic
    } catch (error: unknown) {
      console.error('Action failed', { error })
      setError('Action failed. Please try again.')
    }
  }
}
```

## Rules for Testing

- ALWAYS analyze existing patterns in the file and repository and follow them EXACTLY
- **ALL TESTS MUST BE DETERMINISTIC** (no randomness, conditionals, or time-dependent values)
- ALWAYS test user-facing functionality (BAD: expect this object to have certain CSS, BAD: expect this object to be disable, GOOD: try to click on this object and expect no service call, GOOD: is the expected text visible)
- Use comments to explain WHY rather than WHAT, and use them sparingly
- Jest is configured to clear mocks after each test -- NEVER CALL jest.clearAllMocks()
- NEVER use beforeEach or afterEach -- use shared setup/teardown functions defined within the test and invoke them in each test
- EXCLUSIVELY use `mock...Once` in tests and `mock...` (without Once) in beforeAll
- Use jest.mocked for type-safe mocking
- Use UserEvent for interacting with the DOM, when possible
- NEVER use jest.spyOn
- Every exported function should be tested on its own with its own describe block

### Deterministic Testing Requirements

```typescript
// BAD - Non-deterministic:
const timestamp = Date.now()
const randomId = Math.random().toString()
const conditionalValue = Math.random() > 0.5 ? 'a' : 'b'

// GOOD - Deterministic:
const fixedTimestamp = 1640995200000 // Use fixed values
const testId = 'test-message-id-123'
const expectedValue = 'a' // Use consistent test data
```

### Component Mocking Patterns

For mocking components in tests:

```typescript
import Component from '@components/component'

jest.mock('@components/component')

beforeAll(() => {
  jest.mocked(Component).mockReturnValue(<></>)
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
