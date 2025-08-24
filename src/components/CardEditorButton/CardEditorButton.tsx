import React from 'react'
import styles from './CardEditorButton.module.css'

interface CardEditorButtonProps {
    onClick: () => void
    isVisible: boolean
}

const CardEditorButton: React.FC<CardEditorButtonProps> = ({
    onClick,
    isVisible,
}) => {
    if (!isVisible) return null

    return (
        <button
            className={styles.cardEditorButton}
            onClick={onClick}
            title="Add New Card"
            aria-label="Add New Card"
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="9" x2="12" y2="15" />
                <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
            <span className={styles.text}>Add Card</span>
        </button>
    )
}

export default CardEditorButton
