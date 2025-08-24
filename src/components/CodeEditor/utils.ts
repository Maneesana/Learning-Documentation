import { FileNode, Tab } from './types'

export const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        html: 'html',
        css: 'css',
        scss: 'scss',
        sass: 'scss',
        json: 'json',
        md: 'markdown',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml',
        sql: 'sql',
        php: 'php',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        cs: 'csharp',
        go: 'go',
        rs: 'rust',
        rb: 'ruby',
        kt: 'kotlin',
        swift: 'swift',
    }
    return languageMap[extension || ''] || 'plaintext'
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export const saveToLocalStorage = (key: string, data: any) => {
    if (!isBrowser) return

    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error('Failed to save to localStorage:', error)
    }
}

export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
    if (!isBrowser) return defaultValue

    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error('Failed to load from localStorage:', error)
        return defaultValue
    }
}

export const generateInitialFiles = (): FileNode[] => {
    return [
        {
            id: 'root',
            name: 'workspace',
            type: 'folder',
            isOpen: true,
            children: [
                {
                    id: 'file-1',
                    name: 'index.js',
                    type: 'file',
                    content:
                        '// Welcome to your code editor!\nconsole.log("Hello, World!");',
                    language: 'javascript',
                },
                {
                    id: 'file-2',
                    name: 'styles.css',
                    type: 'file',
                    content:
                        '/* Your CSS styles */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
                    language: 'css',
                },
                {
                    id: 'file-3',
                    name: 'README.md',
                    type: 'file',
                    content:
                        '# My Project\n\nThis is a sample README file.\n\n## Getting Started\n\nStart coding!',
                    language: 'markdown',
                },
                {
                    id: 'folder-1',
                    name: 'components',
                    type: 'folder',
                    isOpen: false,
                    children: [
                        {
                            id: 'file-4',
                            name: 'Button.jsx',
                            type: 'file',
                            content:
                                'import React from "react";\n\nconst Button = ({ children, onClick }) => {\n  return (\n    <button onClick={onClick}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;',
                            language: 'javascript',
                        },
                    ],
                },
            ],
        },
    ]
}

export const createNewFile = (name: string, content: string = ''): FileNode => {
    return {
        id: `file-${Date.now()}`,
        name,
        type: 'file',
        content,
        language: getLanguageFromExtension(name),
    }
}

export const createNewFolder = (name: string): FileNode => {
    return {
        id: `folder-${Date.now()}`,
        name,
        type: 'folder',
        isOpen: false,
        children: [],
    }
}
