# Core Components

This directory contains reusable core components that can be used across the entire application.

## CustomScrollbar

A global scrollbar component with multiple variants for consistent styling across the app.

### Usage

```tsx
import { CustomScrollbar } from '@/components/core';

// Default scrollbar (5px width)
<CustomScrollbar className="h-64 overflow-y-auto">
  <div>Your scrollable content here</div>
</CustomScrollbar>

// Thin scrollbar (3px width)
<CustomScrollbar variant="thin" className="h-64 overflow-y-auto">
  <div>Your scrollable content here</div>
</CustomScrollbar>

// Hidden scrollbar
<CustomScrollbar variant="hidden" className="h-64 overflow-y-auto">
  <div>Your scrollable content here</div>
</CustomScrollbar>
```

### Props

- `children`: React.ReactNode - The content to be wrapped
- `className?: string` - Additional CSS classes
- `variant?: 'default' | 'thin' | 'hidden'` - Scrollbar variant

### Variants

- **default**: 5px width scrollbar with brand colors (matches your current style)
- **thin**: 3px width scrollbar for more subtle appearance
- **hidden**: Completely hidden scrollbar

### Features

- ✅ Consistent styling across the app
- ✅ Multiple variants for different use cases
- ✅ Automatic CSS injection
- ✅ TypeScript support
- ✅ Responsive design
