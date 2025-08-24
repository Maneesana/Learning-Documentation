# Code Editor Component

A powerful, feature-rich code editor built with Monaco Editor (the same editor that powers VS Code) for your Docusaurus tech blog.

## Features

### 🎯 Core Features

- **Syntax Highlighting**: Support for 20+ programming languages including JavaScript, TypeScript, Python, CSS, HTML, and more
- **Tabbed Interface**: Multiple file editing with tab management
- **File Explorer**: Simple file and folder management with create/delete operations
- **Persistent Storage**: All your work is automatically saved to localStorage
- **Modal Design**: Non-intrusive editor that appears as a modal overlay

### 🎨 UI/UX Features

- **80% Screen Coverage**: Optimal viewing space while maintaining context
- **Smooth Animations**: Framer Motion powered slide-in animations
- **Backdrop Blur**: Beautiful backdrop effect when editor is open
- **Dark Theme**: VS Code-style dark theme for comfortable coding
- **Responsive Design**: Works on various screen sizes

### ⌨️ Keyboard Shortcuts

- **Ctrl + Shift + C + D**: Toggle code editor
- **Ctrl + S**: Save current file (marks as clean)
- **All Monaco Editor shortcuts**: Standard VS Code shortcuts work

### 📁 File Management

- Create new files and folders
- Delete files and folders
- Navigate folder structure
- Automatic language detection based on file extension
- File dirty state tracking (shows • when modified)

## Usage

The code editor is integrated into the flashcards page and can be triggered by pressing `Ctrl + Shift + C + D`.

### Available Languages

- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- HTML (.html)
- CSS (.css, .scss, .sass)
- JSON (.json)
- Markdown (.md)
- XML (.xml)
- YAML (.yaml, .yml)
- SQL (.sql)
- PHP (.php)
- Java (.java)
- C++ (.cpp)
- C (.c)
- C# (.cs)
- Go (.go)
- Rust (.rs)
- Ruby (.rb)
- Kotlin (.kt)
- Swift (.swift)

## Technical Implementation

### Components

- `CodeEditor`: Main editor component with Monaco integration
- `FileExplorer`: File tree navigation and management
- `TabBar`: Tab management for open files
- `useKeyboardShortcut`: Custom hook for keyboard shortcut handling

### Dependencies

- `@monaco-editor/react`: React wrapper for Monaco Editor
- `monaco-editor`: The core Monaco Editor
- `framer-motion`: Smooth animations and transitions

### Storage

All data is automatically persisted to localStorage:

- File structure and content
- Open tabs
- Active tab state

## Getting Started

1. Navigate to the flashcards page
2. Press `Ctrl + Shift + C + D` to open the editor
3. Use the file explorer to create new files or open existing ones
4. Start coding with full syntax highlighting and IntelliSense
5. Your work is automatically saved to localStorage

## Customization

The editor is highly customizable through Monaco Editor options. You can modify:

- Theme (currently set to `vs-dark`)
- Font size and family
- Minimap settings
- Word wrap behavior
- And much more...

Enjoy coding! 🚀
