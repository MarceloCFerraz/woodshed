import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// RTL only auto-cleans between tests when test globals are enabled; we keep
// globals off, so unmount rendered trees explicitly.
afterEach(cleanup)
