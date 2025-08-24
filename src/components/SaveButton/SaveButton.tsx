import React, { useState, useEffect } from 'react'
import styles from './SaveButton.module.css'

interface SaveButtonProps {
    onSave: () => void
    disabled?: boolean
}

const SaveButton: React.FC<SaveButtonProps> = ({
    onSave,
    disabled = false,
}) => {
    const [showSaved, setShowSaved] = useState(false)

    const handleClick = () => {
        onSave()
        setShowSaved(true)
    }

    useEffect(() => {
        if (showSaved) {
            const timer = setTimeout(() => {
                setShowSaved(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [showSaved])

    return (
        <button
            className={`${styles.saveButton} ${disabled ? styles.disabled : ''} ${showSaved ? styles.saved : ''}`}
            onClick={handleClick}
            disabled={disabled}
            title="Save Cards to Local Storage"
            aria-label="Save Cards"
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
                className={styles.icon}
            >
                {showSaved ? (
                    <polyline points="20,6 9,17 4,12" />
                ) : (
                    <>
                        <path d="M19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H16L21,8V19A2,2 0 0,1 19,21Z" />
                        <polyline points="17,21 17,13 7,13 7,21" />
                        <polyline points="7,3 7,8 15,8" />
                    </>
                )}
            </svg>
            <span className={styles.text}>
                {showSaved ? 'Saved!' : 'Save Cards'}
            </span>
        </button>
    )
}

export default SaveButton
