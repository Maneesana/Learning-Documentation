import React, { useState } from 'react'
import { FileNode } from './types'
import { createNewFile, createNewFolder } from './utils'
import styles from './FileExplorer.module.css'

interface FileExplorerProps {
    files: FileNode[]
    onFileSelect: (file: FileNode) => void
    onFileUpdate: (files: FileNode[]) => void
    selectedFile: FileNode | null
}

const FileExplorer: React.FC<FileExplorerProps> = ({
    files,
    onFileSelect,
    onFileUpdate,
    selectedFile,
}) => {
    const [newItemName, setNewItemName] = useState('')
    const [creatingItem, setCreatingItem] = useState<{
        type: 'file' | 'folder'
        parentId: string
    } | null>(null)

    const toggleFolder = (folderId: string) => {
        const updateFiles = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
                if (node.id === folderId && node.type === 'folder') {
                    return { ...node, isOpen: !node.isOpen }
                }
                if (node.children) {
                    return { ...node, children: updateFiles(node.children) }
                }
                return node
            })
        }
        onFileUpdate(updateFiles(files))
    }

    const addNewItem = (parentId: string, type: 'file' | 'folder') => {
        if (!newItemName.trim()) return

        const newItem =
            type === 'file'
                ? createNewFile(newItemName.trim())
                : createNewFolder(newItemName.trim())

        const updateFiles = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
                if (node.id === parentId && node.type === 'folder') {
                    return {
                        ...node,
                        children: [...(node.children || []), newItem],
                        isOpen: true,
                    }
                }
                if (node.children) {
                    return { ...node, children: updateFiles(node.children) }
                }
                return node
            })
        }

        onFileUpdate(updateFiles(files))
        setNewItemName('')
        setCreatingItem(null)
    }

    const deleteItem = (itemId: string) => {
        const updateFiles = (nodes: FileNode[]): FileNode[] => {
            return nodes
                .filter((node) => {
                    if (node.id === itemId) return false
                    if (node.children) {
                        return { ...node, children: updateFiles(node.children) }
                    }
                    return true
                })
                .map((node) => {
                    if (node.children) {
                        return { ...node, children: updateFiles(node.children) }
                    }
                    return node
                })
        }
        onFileUpdate(updateFiles(files))
    }

    const renderFile = (file: FileNode, depth: number = 0) => {
        const isSelected = selectedFile?.id === file.id

        return (
            <div key={file.id} className={styles.fileItem}>
                <div
                    className={`${styles.fileRow} ${isSelected ? styles.selected : ''}`}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                >
                    {file.type === 'folder' ? (
                        <>
                            <button
                                className={styles.folderToggle}
                                onClick={() => toggleFolder(file.id)}
                            >
                                {file.isOpen ? '📂' : '📁'}
                            </button>
                            <span className={styles.fileName}>{file.name}</span>
                            <div className={styles.fileActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCreatingItem({
                                            type: 'file',
                                            parentId: file.id,
                                        })
                                    }}
                                    title="New File"
                                >
                                    📄
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCreatingItem({
                                            type: 'folder',
                                            parentId: file.id,
                                        })
                                    }}
                                    title="New Folder"
                                >
                                    📁
                                </button>
                                {file.id !== 'root' && (
                                    <button
                                        className={styles.actionButton}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteItem(file.id)
                                        }}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <span className={styles.fileIcon}>📄</span>
                            <span
                                className={styles.fileName}
                                onClick={() => onFileSelect(file)}
                            >
                                {file.name}
                            </span>
                            <div className={styles.fileActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteItem(file.id)
                                    }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {creatingItem?.parentId === file.id && (
                    <div
                        className={styles.newItemForm}
                        style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
                    >
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addNewItem(file.id, creatingItem.type)
                                } else if (e.key === 'Escape') {
                                    setCreatingItem(null)
                                    setNewItemName('')
                                }
                            }}
                            placeholder={`New ${creatingItem.type} name`}
                            autoFocus
                            className={styles.newItemInput}
                        />
                        <button
                            onClick={() =>
                                addNewItem(file.id, creatingItem.type)
                            }
                            className={styles.confirmButton}
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => {
                                setCreatingItem(null)
                                setNewItemName('')
                            }}
                            className={styles.cancelButton}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {file.type === 'folder' && file.isOpen && file.children && (
                    <div className={styles.folderContents}>
                        {file.children.map((child) =>
                            renderFile(child, depth + 1)
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={styles.fileExplorer}>
            <div className={styles.header}>
                <h3>Explorer</h3>
            </div>
            <div className={styles.fileTree}>
                {files.map((file) => renderFile(file))}
            </div>
        </div>
    )
}

export default FileExplorer
