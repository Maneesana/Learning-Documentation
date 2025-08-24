import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Editor } from '@monaco-editor/react'
import FileExplorer from './FileExplorer'
import TabBar from './TabBar'
import { FileNode, Tab, CodeEditorProps } from './types'
import { ThemeProvider, useTheme, Theme } from './ThemeContext'
import {
    generateInitialFiles,
    saveToLocalStorage,
    loadFromLocalStorage,
    getLanguageFromExtension,
} from './utils'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import styles from './CodeEditor.module.css'

const STORAGE_KEYS = {
    FILES: 'codeEditor_files',
    TABS: 'codeEditor_tabs',
    ACTIVE_TAB: 'codeEditor_activeTab',
}

const CodeEditorContent: React.FC<CodeEditorProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme()
    const [files, setFiles] = useState<FileNode[]>(generateInitialFiles())
    const [tabs, setTabs] = useState<Tab[]>([])
    const [activeTabId, setActiveTabId] = useState<string>('')
    const [editorValue, setEditorValue] = useState<string>('')
    const [isInitialized, setIsInitialized] = useState(false)
    const editorRef = useRef<any>(null)
    const activeTabIdRef = useRef<string>('')

    // Save function
    const handleSave = useCallback(() => {
        const currentActiveTabId = activeTabIdRef.current
        if (currentActiveTabId) {
            setTabs((prevTabs) =>
                prevTabs.map((tab) =>
                    tab.id === currentActiveTabId
                        ? { ...tab, isDirty: false }
                        : tab
                )
            )
        }
    }, [])

    // Keyboard shortcut for save: Ctrl + S (only when editor is open)
    useKeyboardShortcut({
        keys: ['ctrl', 's'],
        onTriggered: handleSave,
        enabled: isOpen,
    })

    // Load state from localStorage on client side
    useEffect(() => {
        if (typeof window !== 'undefined' && !isInitialized) {
            const savedFiles = loadFromLocalStorage(STORAGE_KEYS.FILES, null)
            const savedTabs = loadFromLocalStorage(STORAGE_KEYS.TABS, [])
            const savedActiveTab = loadFromLocalStorage(
                STORAGE_KEYS.ACTIVE_TAB,
                ''
            )

            if (savedFiles) {
                setFiles(savedFiles)
            }
            setTabs(savedTabs)
            setActiveTabId(savedActiveTab)
            setIsInitialized(true)
        }
    }, [])

    // Define custom themes for Monaco Editor
    const defineCustomThemes = useCallback((monaco: any) => {
        // Dark theme with transparency (Catppuccin Mocha inspired)
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'cdd6f4' }, // Text - Catppuccin text
                { token: 'comment', foreground: '6c7086', fontStyle: 'italic' }, // Overlay2
                { token: 'keyword', foreground: 'cba6f7', fontStyle: 'bold' }, // Mauve
                { token: 'string', foreground: 'a6e3a1' }, // Green
                { token: 'number', foreground: 'fab387' }, // Peach
                { token: 'type', foreground: 'f9e2af' }, // Yellow
                { token: 'function', foreground: '89b4fa' }, // Blue
                { token: 'variable', foreground: 'cdd6f4' }, // Text
                { token: 'constant', foreground: 'fab387' }, // Peach
                { token: 'operator', foreground: '94e2d5' }, // Teal
                { token: 'delimiter', foreground: 'bac2de' }, // Subtext1
                { token: 'class', foreground: 'f9e2af' }, // Yellow
                { token: 'interface', foreground: 'f9e2af' }, // Yellow
                { token: 'namespace', foreground: 'f9e2af' }, // Yellow
                { token: 'property', foreground: '89b4fa' }, // Blue
                { token: 'tag', foreground: 'f38ba8' }, // Red
                { token: 'attribute', foreground: 'fab387' }, // Peach
            ],
            colors: {
                'editor.background': '#00000000', // Transparent
                'editor.foreground': '#cdd6f4', // Text
                'editor.lineHighlightBackground': '#313244', // Surface0
                'editor.selectionBackground': '#585b7050', // Surface2 with transparency
                'editor.inactiveSelectionBackground': '#45475a30', // Surface1 with transparency
                'editorLineNumber.foreground': '#6c7086', // Overlay2
                'editorLineNumber.activeForeground': '#cdd6f4', // Text
                'editorCursor.foreground': '#f5c2e7', // Pink
                'editor.findMatchBackground': '#fab38750', // Peach with transparency
                'editor.findMatchHighlightBackground': '#fab38730', // Peach with less transparency
                'editorBracketMatch.background': '#cba6f750', // Mauve with transparency
                'editorBracketMatch.border': '#cba6f7', // Mauve
                'editorIndentGuide.background': '#45475a', // Surface1
                'editorIndentGuide.activeBackground': '#585b70', // Surface2
                'editorGutter.background': '#00000000',
                'editorLineNumber.background': '#00000000',
            },
        })

        // Light theme with transparency (Catppuccin Latte inspired)
        monaco.editor.defineTheme('custom-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: '', foreground: '4c4f69' }, // Text - Catppuccin text
                { token: 'comment', foreground: '9ca0b0', fontStyle: 'italic' }, // Overlay2
                { token: 'keyword', foreground: '8839ef', fontStyle: 'bold' }, // Mauve
                { token: 'string', foreground: '40a02b' }, // Green
                { token: 'number', foreground: 'fe640b' }, // Peach
                { token: 'type', foreground: 'df8e1d' }, // Yellow
                { token: 'function', foreground: '1e66f5' }, // Blue
                { token: 'variable', foreground: '4c4f69' }, // Text
                { token: 'constant', foreground: 'fe640b' }, // Peach
                { token: 'operator', foreground: '179299' }, // Teal
                { token: 'delimiter', foreground: '5c5f77' }, // Subtext1
                { token: 'class', foreground: 'df8e1d' }, // Yellow
                { token: 'interface', foreground: 'df8e1d' }, // Yellow
                { token: 'namespace', foreground: 'df8e1d' }, // Yellow
                { token: 'property', foreground: '1e66f5' }, // Blue
                { token: 'tag', foreground: 'd20f39' }, // Red
                { token: 'attribute', foreground: 'fe640b' }, // Peach
            ],
            colors: {
                'editor.background': '#00000000', // Transparent
                'editor.foreground': '#4c4f69', // Text
                'editor.lineHighlightBackground': '#dce0e8', // Surface0
                'editor.selectionBackground': '#acb0be50', // Surface2 with transparency
                'editor.inactiveSelectionBackground': '#bcc0cc30', // Surface1 with transparency
                'editorLineNumber.foreground': '#9ca0b0', // Overlay2
                'editorLineNumber.activeForeground': '#4c4f69', // Text
                'editorCursor.foreground': '#ea76cb', // Pink
                'editor.findMatchBackground': '#fe640b50', // Peach with transparency
                'editor.findMatchHighlightBackground': '#fe640b30', // Peach with less transparency
                'editorBracketMatch.background': '#8839ef50', // Mauve with transparency
                'editorBracketMatch.border': '#8839ef', // Mauve
                'editorIndentGuide.background': '#bcc0cc', // Surface1
                'editorIndentGuide.activeBackground': '#acb0be', // Surface2
                'editorGutter.background': '#00000000',
                'editorLineNumber.background': '#00000000',
            },
        })
    }, [])

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.FILES, files)
    }, [files])

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.TABS, tabs)
    }, [tabs])

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.ACTIVE_TAB, activeTabId)
    }, [activeTabId])

    // Update editor value when active tab changes
    useEffect(() => {
        activeTabIdRef.current = activeTabId
        const activeTab = tabs.find((tab) => tab.id === activeTabId)
        if (activeTab) {
            setEditorValue(activeTab.content)
        }
    }, [activeTabId, tabs])

    const handleFileSelect = useCallback(
        (file: FileNode) => {
            if (file.type !== 'file') return

            // Check if tab already exists
            const existingTab = tabs.find((tab) => tab.id === file.id)
            if (existingTab) {
                setActiveTabId(file.id)
                return
            }

            // Create new tab
            const newTab: Tab = {
                id: file.id,
                name: file.name,
                content: file.content || '',
                language: file.language || getLanguageFromExtension(file.name),
                isDirty: false,
            }

            setTabs((prevTabs) => [...prevTabs, newTab])
            setActiveTabId(file.id)
        },
        [tabs]
    )

    const handleTabClose = useCallback(
        (tabId: string) => {
            setTabs((prevTabs) => {
                const newTabs = prevTabs.filter((tab) => tab.id !== tabId)

                // If closing active tab, switch to another tab
                if (tabId === activeTabId) {
                    const currentIndex = prevTabs.findIndex(
                        (tab) => tab.id === tabId
                    )
                    let newActiveTabId = ''

                    if (newTabs.length > 0) {
                        // Switch to previous tab or first tab
                        const newIndex = Math.max(0, currentIndex - 1)
                        newActiveTabId = newTabs[newIndex]?.id || newTabs[0].id
                    }

                    setActiveTabId(newActiveTabId)
                }

                return newTabs
            })
        },
        [activeTabId]
    )

    const handleEditorChange = useCallback(
        (value: string | undefined) => {
            if (value === undefined) return

            setEditorValue(value)

            // Update tab content and mark as dirty
            setTabs((prevTabs) =>
                prevTabs.map((tab) =>
                    tab.id === activeTabId
                        ? { ...tab, content: value, isDirty: true }
                        : tab
                )
            )

            // Update file content
            const updateFileContent = (nodes: FileNode[]): FileNode[] => {
                return nodes.map((node) => {
                    if (node.id === activeTabId) {
                        return { ...node, content: value }
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: updateFileContent(node.children),
                        }
                    }
                    return node
                })
            }

            setFiles(updateFileContent)
        },
        [activeTabId]
    )

    const handleEditorMount = useCallback(
        (editor: any, monaco: any) => {
            editorRef.current = editor

            // Define custom themes
            defineCustomThemes(monaco)

            // Set the theme based on current theme
            monaco.editor.setTheme(
                theme === 'dark' ? 'custom-dark' : 'custom-light'
            )

            // Add save command (Ctrl+S) - safely check if monaco is available
            if (monaco && monaco.KeyMod && monaco.KeyCode) {
                editor.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                    () => {
                        handleSave()
                    }
                )
            }
        },
        [theme, defineCustomThemes, handleSave]
    )

    // Update Monaco theme when theme changes
    useEffect(() => {
        if (editorRef.current) {
            const monaco = (window as any).monaco
            if (monaco) {
                monaco.editor.setTheme(
                    theme === 'dark' ? 'custom-dark' : 'custom-light'
                )
            }
        }
    }, [theme])

    const activeTab = tabs.find((tab) => tab.id === activeTabId)
    const selectedFile = activeTab
        ? {
              id: activeTab.id,
              name: activeTab.name,
              type: 'file' as const,
              content: activeTab.content,
              language: activeTab.language,
          }
        : null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Editor Container */}
                    <motion.div
                        className={`${styles.editorContainer} ${styles[theme]}`}
                        initial={{ x: '100%' }}
                        animate={{ x: '20%' }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 100,
                        }}
                    >
                        {/* Header */}
                        <div className={`${styles.header} ${styles[theme]}`}>
                            <h2 className={styles.title}>Code Editor</h2>
                            <div className={styles.headerButtons}>
                                <button
                                    className={styles.themeButton}
                                    onClick={toggleTheme}
                                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                >
                                    {theme === 'dark' ? '☀️' : '🌙'}
                                </button>
                                <button
                                    className={styles.closeButton}
                                    onClick={onClose}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div
                            className={`${styles.editorContent} ${styles[theme]}`}
                        >
                            {/* File Explorer */}
                            <div
                                className={`${styles.sidebar} ${styles[theme]}`}
                            >
                                <FileExplorer
                                    files={files}
                                    onFileSelect={handleFileSelect}
                                    onFileUpdate={setFiles}
                                    selectedFile={selectedFile}
                                />
                            </div>

                            {/* Main Editor Area */}
                            <div
                                className={`${styles.mainArea} ${styles[theme]}`}
                            >
                                {tabs.length > 0 && (
                                    <TabBar
                                        tabs={tabs}
                                        activeTabId={activeTabId}
                                        onTabSelect={setActiveTabId}
                                        onTabClose={handleTabClose}
                                    />
                                )}

                                <div
                                    className={`${styles.editorArea} ${styles[theme]}`}
                                >
                                    {activeTab ? (
                                        <Editor
                                            height="100%"
                                            language={activeTab.language}
                                            value={editorValue}
                                            onChange={handleEditorChange}
                                            onMount={handleEditorMount}
                                            theme={
                                                theme === 'dark'
                                                    ? 'custom-dark'
                                                    : 'custom-light'
                                            }
                                            options={{
                                                minimap: { enabled: true },
                                                fontSize: 16,
                                                fontFamily:
                                                    '"JetBrainsMono Nerd Font", "JetBrains Mono", "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
                                                fontWeight: '400',
                                                lineHeight: 1.6,
                                                letterSpacing: 0.5,
                                                wordWrap: 'on',
                                                automaticLayout: true,
                                                scrollBeyondLastLine: false,
                                                renderWhitespace: 'selection',
                                                tabSize: 2,
                                                insertSpaces: true,
                                                folding: true,
                                                lineNumbers: 'on',
                                                roundedSelection: false,
                                                cursorBlinking: 'smooth',
                                                cursorSmoothCaretAnimation:
                                                    'on',
                                                smoothScrolling: true,
                                                padding: {
                                                    top: 16,
                                                    bottom: 16,
                                                },
                                                bracketPairColorization: {
                                                    enabled: true,
                                                },
                                                guides: {
                                                    bracketPairs: true,
                                                    indentation: true,
                                                },
                                                suggest: {
                                                    showKeywords: true,
                                                    showSnippets: true,
                                                },
                                                scrollbar: {
                                                    vertical: 'visible',
                                                    horizontal: 'visible',
                                                    verticalScrollbarSize: 12,
                                                    horizontalScrollbarSize: 12,
                                                },
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className={`${styles.welcomeScreen} ${styles[theme]}`}
                                        >
                                            <div
                                                className={
                                                    styles.welcomeContent
                                                }
                                            >
                                                <h3>Welcome to Code Editor</h3>
                                                <p>
                                                    Select a file from the
                                                    explorer to start editing
                                                </p>
                                                <div
                                                    className={styles.shortcuts}
                                                >
                                                    <h4>Keyboard Shortcuts:</h4>
                                                    <ul>
                                                        <li>
                                                            <kbd>Ctrl+S</kbd> -
                                                            Save file
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Wrapper component with ThemeProvider
const CodeEditor: React.FC<CodeEditorProps> = (props) => {
    return (
        <ThemeProvider>
            <CodeEditorContent {...props} />
        </ThemeProvider>
    )
}

export default CodeEditor
