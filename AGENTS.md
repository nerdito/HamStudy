# AGENTS.md - HamStudy Development Guide

This file provides guidance for AI agents working on the HamStudy project.

## 1. Commands

### Development
```bash
npm run dev          # Start Vite dev server at http://localhost:5173
npm run build        # Production build (generates build-number.js + Vite build)
npm run preview      # Preview production build locally
```

### Testing
```bash
npm test             # Run all tests with Jest
npm test -- src/__tests__/File.test.jsx   # Run a single test file
npm run test:coverage # Run tests with coverage report
```

### Linting
```bash
npm run lint         # Run ESLint on all files
```

## 2. Code Style Guidelines

### Imports
- Order: external libraries → internal modules (context, utils, components) → CSS
- Example:
```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { getVoices } from '../utils/tts'
import QuestionCard from './QuestionCard'
import './QuestionCard.css'
```

### Components
- Use PascalCase for component names (e.g., `QuestionCard`, `ExamResults`)
- Use function components with React hooks
- Default export components using `export default`

### Naming Conventions
- **Variables/functions**: camelCase (e.g., `handleAnswer`, `isFlipped`)
- **Components**: PascalCase (e.g., `QuestionCard`, `FlashcardsPage`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_QUESTIONS`, `LICENSE_NAMES`)
- **CSS classes**: kebab-case with BEM-like patterns (e.g., `.question-card`, `.answer-button--correct`)

### CSS & Theming
- Use CSS variables for all colors, spacing, and theming
- Define variables in `src/index.css` under `:root` for light theme
- Dark mode uses `[data-theme='dark']` selector to override variables
- Example:
```css
:root {
  --primary-color: #2563eb;
  --bg-secondary: #ffffff;
}

[data-theme='dark'] {
  --primary-color: #e94560;
  --bg-secondary: #16213e;
}
```

### React Patterns
- Use Context API for global state (see `SettingsContext.jsx`)
- Use `useCallback` for functions passed to child components to prevent unnecessary re-renders
- Use `useMemo` for expensive calculations
- ALWAYS include all dependencies in useEffect/useCallback arrays (enforced by `react-hooks/exhaustive-deps`)

### Error Handling
- Provide graceful fallbacks for optional context values:
```jsx
const settings = settingsContext?.settings || { 
  ttsEnabled: false, 
  ttsSpeed: 1.0 
}
```
- Handle missing data with null checks: `questions[index]?.correct`

## 3. Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── QuestionCard.jsx
│   ├── ExamResults.jsx
│   ├── Flashcards.jsx
│   └── OfflineIndicator.jsx
├── pages/               # Route-level components
│   ├── Home.jsx
│   ├── Study.jsx
│   ├── Practice.jsx
│   ├── Settings.jsx
│   ├── Stats.jsx
│   └── FlashcardsPage.jsx
├── context/             # React Context providers
│   └── SettingsContext.jsx
├── utils/               # Utility functions
│   ├── tts.js           # Text-to-speech helpers
│   └── categories.js
├── data/                # Question JSON data
│   ├── technician.json
│   ├── general.json
│   └── extra.json
├── __tests__/           # Jest test files
│   ├── Exam.test.jsx
│   ├── QuestionCard.test.jsx
│   └── SettingsContext.test.jsx
├── App.jsx              # Main app with routing
└── index.css            # Global styles and CSS variables
```

## 4. Workflow Rules

### Pull Request Process
1. **Create branch** from `main`: `git checkout -b feature/your-feature`
2. **Implement changes** following code style guidelines
3. **Run tests locally** - MUST pass before pushing:
   ```bash
   npm run lint
   npm test
   ```
4. **Push and create PR** with clear description
   - Include "Closes #XX" to link issues (GitHub auto-closes when PR merges)
5. **Launch reviewer agent** to review the PR (see below)
6. **Wait for CI** - Lint, tests, and build must pass in GitHub Actions
7. **DO NOT merge** - Wait for human review and merge

### Reviewer Agent
After creating a PR, launch the reviewer agent to provide AI code review:

1. Use the **Task tool** with **general** subagent type
2. Provide the PR number in the prompt
3. The reviewer uses **Ollama qwen2.5-coder:3b** model to analyze the PR
4. Review is posted as a PR comment

Example:
```
Task: Review PR #33 using the reviewer agent instructions in REVIEWER_AGENT.md
```

### Important Rules
- NEVER commit directly to `main` branch
- ALL changes must go via Pull Requests
- Run `npm test` and `npm run lint` locally before creating PR
- Tests must pass before PR can be merged
- Use "Closes #XX" in PR body to auto-close issues on merge
- ALWAYS launch reviewer agent after PR creation

## 5. Testing Guidelines

### Test Structure
```jsx
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText(/expected/i)).toBeInTheDocument()
  })
})
```

### Testing Libraries
- Jest for test runner
- @testing-library/react for component testing
- @testing-library/jest-dom for DOM assertions
- Use `jest.fn()` for mocking functions

## 6. Build & Deployment

- Vite is used for building (configured in `vite.config.js`)
- PWA support via `vite-plugin-pwa` (service worker auto-generated)
- GitHub Actions handles CI/CD (see `.github/workflows/test.yml`)
- Deploys to GitHub Pages on merge to `main`

## 7. Known Issues / Gotchas

- The `inflight` npm deprecation warning is cosmetic and can be ignored
- The build chunk size warning (>500KB) exists but hasn't been addressed yet
- `build-number.js` is generated at build time and is gitignored - workflow generates it before tests
