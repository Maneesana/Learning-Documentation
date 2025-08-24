import React from 'react'
import styles from './EditModeToggle.module.css'

interface EditModeToggleProps {
    isEditMode: boolean
    onToggle: () => void
}

const EditModeToggle: React.FC<EditModeToggleProps> = ({
    isEditMode,
    onToggle,
}) => {
    return (
        <button
            className={`${styles.editModeToggle} ${isEditMode ? styles.active : ''}`}
            onClick={onToggle}
            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            aria-label={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.icon}
            >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className={styles.text}>
                {isEditMode ? 'Exit Edit' : 'Edit Cards'}
            </span>
        </button>
    )
}

export default EditModeToggle
