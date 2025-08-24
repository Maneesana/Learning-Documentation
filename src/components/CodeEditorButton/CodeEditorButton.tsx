import React from 'react'
import styles from './CodeEditorButton.module.css'

interface CodeEditorButtonProps {
    onClick: () => void
    isOpen: boolean
}

const CodeEditorButton: React.FC<CodeEditorButtonProps> = ({
    onClick,
    isOpen,
}) => {
    return (
        <button
            className={`${styles.codeEditorButton} ${isOpen ? styles.active : ''}`}
            onClick={onClick}
            title={
                isOpen
                    ? 'Close Code Editor'
                    : 'Open Code Editor (Ctrl+Shift+C+D)'
            }
            aria-label={isOpen ? 'Close Code Editor' : 'Open Code Editor'}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.icon}
            >
                <polyline points="16,18 22,12 16,6" />
                <polyline points="8,6 2,12 8,18" />
            </svg>
            <span className={styles.text}>{isOpen ? 'Close' : 'Code'}</span>
        </button>
    )
}

export default CodeEditorButton
