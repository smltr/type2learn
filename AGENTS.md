# Type2Learn - Current State Documentation

## Overview
Type2Learn is a code typing practice application with a VS Code-inspired interface. The app helps users improve programming muscle memory by requiring them to memorize and type code snippets without copy-pasting. It features a three-panel layout mimicking VS Code's UI with a file explorer, code editor, and AI assistant chat panel.


## Current Implementation Status

### ✅ Core Features Implemented

#### 1. UI/UX - VS Code Theme
- **Three-panel layout** with accurate VS Code styling:
  - Left: File explorer sidebar (fixed width: 208px)
  - Center: Code editor with tab bar and terminal panel
  - Right: AI assistant chat panel (fixed width: 420px)
- **Color scheme**: Authentic VS Code dark theme
  - Background: `#1e1e1e`
  - Sidebar: `#252526`
  - Top bar: `#323233`
  - Borders: Various shades for depth
- **VS Code elements**:
  - Top menu bar with app title
  - File explorer with folder/file icons
  - Tab bar showing "practice.tsx"
  - Terminal panel at bottom (160px height) with "ABOUT" section
  - Line numbers in the editor

#### 2. Code Editor Component (`CodeTyping.tsx`)
- **Editor**: Uses `react-simple-code-editor` for typing practice
- **Syntax highlighting**: PrismJS with JavaScript and TypeScript support
- **Line numbers**: Displayed in left gutter with proper styling
- **Real-time validation**: Compares user input against target code
- **Completion detection**: Shows green checkmark and ring when code matches exactly
- **Styling**: Monospace font (Menlo/Monaco), proper spacing, VS Code colors

#### 3. AI Assistant Panel (`CodeDisplay.tsx`)
- **Chat-style interface**: AI avatar with messages
- **Code display**: Syntax-highlighted code blocks using `prism-react-renderer`
- **Instructions**: Clear practice guidelines including:
  - Read and understand the code
  - Type from memory
  - No copy-pasting allowed
  - Explanation of "chunking" for learning
- **Theme**: Night Owl theme for code blocks

#### 4. Code Snippets System (`lib/snippets.ts`)
- **5 practice snippets** covering various difficulty levels:
  1. Simple Function (easy) - JavaScript greeting function
  2. Array Map (easy) - JavaScript array manipulation
  3. React Component (medium) - TypeScript React button with props
  4. Async Fetch (medium) - TypeScript async/await with error handling
  5. Class with Constructor (hard) - TypeScript class with private properties
- **Snippet interface**: `id`, `title`, `language`, `code`, `difficulty`
- **Language support**: JavaScript and TypeScript

#### 5. Navigation System (`app/page.tsx`)
- **State management**: React useState for current snippet index
- **Progress tracking**: Set of completed snippet IDs
- **Navigation buttons**: Previous/Next controls in assistant panel
- **Button states**: Disabled at boundaries (first/last snippet)

#### 5.1 Sidebar Components
- **History sidebar**: Extracted into a dedicated component (`HistorySidebar.tsx`)
- **Assistant sidebar**: Extracted into a dedicated component (`AssistantSidebar.tsx`) which also owns the Previous/Next navigation UI

#### 6. Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom themes
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Code highlighting**: 
  - `prism-react-renderer` (display)
  - `prismjs` (editor)
- **UI Components**: shadcn/ui components configured

#### 7. LLM Snippet Generator (Gemini)
- **Placement**: Assistant panel includes a generator card under the intro message
- **Controls**: Language dropdown (TypeScript/JavaScript/Python), preset topic dropdown (syntax, loops, if statements, maps, binary trees, recursion patterns), and free-text topic input
- **Behavior**: Calls `/api/generate` to Gemini 1.5 Flash with a short cooldown to avoid rapid-fire requests; appends generated snippet to the practice list and jumps to it
- **Dependencies**: Requires `GEMINI_API_KEY` env var; front-end guard only (no server-side rate limiting or persistence)

### 📂 File Structure

```
type2learn/
├── app/
│   ├── globals.css          # Tailwind v4 config + theme variables
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── page.tsx              # Main page with VS Code layout
├── components/
│   ├── CodeDisplay.tsx       # AI assistant chat panel with code display
│   └── CodeTyping.tsx        # Code editor with validation
│   ├── AssistantSidebar.tsx  # Right sidebar (chat + navigation)
│   ├── HistorySidebar.tsx    # Left sidebar (history/file list)
│   └── ReactIcon.tsx         # React icon used in history list
├── lib/
│   ├── snippets.ts           # Code snippet definitions
│   └── utils.ts              # Utility functions (likely cn helper)
└── public/                   # Static assets
```

### 🎨 Design Decisions

1. **VS Code Fidelity**: High attention to detail matching VS Code's exact color palette and spacing
2. **Fixed Panel Widths**: Sidebar (208px) and chat (420px) are fixed; editor is flexible
3. **No Resizing**: Panels are not resizable (could be future enhancement)
4. **Monospace Consistency**: Ensures alignment between line numbers and code
5. **Terminal Panel**: Currently static with creator info; could be used for feedback/hints
6. **Chat-style Learning**: Assistant presents code as a conversational guide

### 🔧 Current Limitations & Future Opportunities

#### State Management
- Completed snippets are tracked but not persisted (lost on refresh)
- No local storage or database integration
- Progress resets when page reloads
- Generated snippets are also not persisted; refresh loses them

#### Editor Features
- No syntax error checking during typing
- No autocomplete or IntelliSense
- Can't switch between different files
- No undo/redo beyond browser defaults

#### Snippet System
- Only 5 built-in snippets by default
- No difficulty filtering or selection
- No random shuffle option
- Can't add custom snippets
- No snippet categories (React, Node, algorithms, etc.)
- LLM-generated snippets are transient and not saved outside the session

#### Progress & Gamification
- No statistics (WPM, accuracy, time taken)
- No streak tracking
- No achievements or badges
- No leaderboard or social features
- Completion checkmark doesn't save anywhere

#### UI Enhancements
- Panels are not resizable
- No keyboard shortcuts (besides typing)
- No dark/light theme toggle (always dark)
- Can't hide/show panels
- No settings panel

#### Learning Features
- No hints system if stuck
- No explanation of what each line does
- Can't reveal one line at a time
- No practice modes (e.g., comment-guided)
- No spaced repetition algorithm
- LLM generator provides code only; no line-by-line explanations yet

### 🎯 Well-Architected Aspects

1. **Component Separation**: Clear separation between display and typing components
2. **Type Safety**: Full TypeScript implementation with proper interfaces
3. **Styling Approach**: Tailwind with precise custom values for VS Code replication
4. **React Patterns**: Proper hooks usage, ref management for completion tracking
5. **Code Organization**: Logical file structure following Next.js conventions
6. **Accessibility**: Monospace fonts, good contrast ratios
7. **Performance**: No unnecessary re-renders, efficient completion detection

### 💡 Technical Notes

#### Editor Implementation
- Uses `react-simple-code-editor` which provides a controlled textarea overlay
- Custom styling ensures textarea and highlighted pre tag align perfectly
- Line numbers are a separate scrollable div (doesn't scroll with code currently)

#### Completion Detection
- Uses `useRef` to prevent multiple `onComplete` calls
- Exact string matching (whitespace-sensitive)
- Green ring animation via Tailwind classes

#### VS Code Colors Reference
- Editor background: `#1e1e1e`
- Sidebar background: `#252526`
- Top bar: `#323233`
- Borders: `#1e1e1e`, `#3e3e42`
- Text: `#cccccc`, `#d4d4d4`
- Line numbers: `#858585`
- Accent blue: `#0e639c`

### 🚀 Suggested Next Steps

**High Priority:**
1. Add localStorage to persist progress across sessions
2. Implement snippet difficulty filter/selector
3. Add statistics tracking (time, accuracy, completions)
4. Create more diverse code snippets
5. Add keyboard shortcuts (Cmd+K for next, etc.)

**Medium Priority:**
6. Make panels resizable (drag borders)
7. Add hints system (reveal line by line)
8. Implement different practice modes
9. Add syntax error highlighting while typing
10. Create settings panel for customization

**Low Priority:**
11. Add light theme support
12. Implement spaced repetition
13. Add social features/leaderboard
14. Export/import custom snippet collections
15. Add audio feedback for completion


### 🌱 Future Features / Ideas
- Vim-style motions and modal editing to speed practice (likely requires swapping the editor to Codemirror or Monaco for richer keybinding support)
- Smarter editing helpers (auto-indent, bracket matching, auto-closing pairs) to better mimic IDE ergonomics
- Optional practice history diffing to compare attempts over time

**How to keep this section updated:**
- Add each new idea as a bullet with one-line context; remove or mark done when implemented
- Note dependencies or prerequisites (e.g., "needs Codemirror migration"), so future planning is clear
- When an idea graduates to active work, move it into "Suggested Next Steps" with priority

### 🧪 Current User Flow

1. User sees first snippet in AI assistant panel (right)
2. User reads and studies the code
3. User types code from memory in center editor
4. Real-time validation shows if code matches
5. Green checkmark appears when complete
6. User clicks "Next →" to move to next snippet
7. Process repeats for all 5 snippets
8. At end, both navigation buttons are disabled

### 📝 Maintaining This Documentation

This `agents.md` file serves as a living document to track the application's evolution. Keep it updated to maintain context for AI assistants and future development.

**When to update:**
- ✅ After implementing new features (move from "Suggested Next Steps" to "Core Features")
- ✅ When fixing bugs or addressing limitations
- ✅ After adding new dependencies or changing tech stack
- ✅ When making significant architectural changes
- ✅ After user testing reveals new insights

**What to update:**
1. **Core Features Implemented** - Add new capabilities with implementation details
2. **Current Limitations** - Remove resolved issues, add newly discovered ones
3. **File Structure** - Update when adding new directories or key files
4. **Version number** - Increment (0.1.0 → 0.2.0 for features, 0.1.0 → 0.1.1 for fixes)
5. **Last Updated date** - Change to current date
6. **Status** - Update project phase (MVP → Beta → Production)

**Suggested workflow:**
```bash
# Before starting work on a feature
1. Review this document to understand current state
2. Check "Suggested Next Steps" for planned work

# After completing a feature
1. Update relevant sections in agents.md
2. Move completed items from suggestions to implementation
3. Note any new limitations discovered
4. Update version number and date
```

**Version History:**
- **0.2.0** (Dec 17, 2025) - Added Gemini-powered snippet generator in assistant panel
- **0.2.1** (Dec 19, 2025) - Extracted History/Assistant sidebars into dedicated components
- **0.1.0** (Dec 16, 2025) - Initial documentation of functional MVP

---

**Last Updated**: December 19, 2025  
**Version**: 0.2.1  
**Status**: Functional MVP with strong foundation for expansion
