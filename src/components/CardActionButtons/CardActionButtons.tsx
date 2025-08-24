import React from 'react'
import styles from './CardActionButtons.module.css'

interface CardActionButtonsProps {
    onEdit: () => void
    onDelete: () => void
    isVisible: boolean
    editMode?: boolean
}

const CardActionButtons: React.FC<CardActionButtonsProps> = ({
    onEdit,
    onDelete,
    isVisible,
    editMode = false,
}) => {
    if (!isVisible) return null

    return (
        <div
            className={`${styles.actionButtons} ${isVisible ? styles.visible : ''} ${editMode ? styles.editModeActive : ''}`}
        >
            <button
                className={styles.editButton}
                onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                }}
                title="Edit Card"
                aria-label="Edit Card"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </button>
            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
                title="Delete Card"
                aria-label="Delete Card"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="3,6 5,6 21,6" />
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            </button>
        </div>
    )
}

export default CardActionButtons
