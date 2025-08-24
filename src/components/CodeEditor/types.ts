export interface FileNode {
    id: string
    name: string
    type: 'file' | 'folder'
    content?: string
    language?: string
    children?: FileNode[]
    isOpen?: boolean
}

export interface Tab {
    id: string
    name: string
    content: string
    language: string
    isDirty: boolean
}

export interface CodeEditorProps {
    isOpen: boolean
    onClose: () => void
}
