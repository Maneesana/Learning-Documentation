import React, { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import styles from './ResetButton.module.css'

interface ResetButtonProps {
    onReset: () => void
    disabled?: boolean
}

const ResetButton: React.FC<ResetButtonProps> = ({
    onReset,
    disabled = false,
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleClick = () => {
        setShowConfirmDialog(true)
    }

    const handleConfirm = () => {
        setShowConfirmDialog(false)
        onReset()
    }

    const handleCancel = () => {
        setShowConfirmDialog(false)
    }

    return (
        <>
            <button
                className={`${styles.resetButton} ${disabled ? styles.disabled : ''}`}
                onClick={handleClick}
                disabled={disabled}
                title="Reset to Original Cards"
                aria-label="Reset to Original Cards"
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
                    <polyline points="1,4 1,10 7,10" />
                    <path d="M3.51,15A9,9 0 0,0 21,12A9,9 0 0,0 12,3A9,9 0 0,0 3.51,15Z" />
                </svg>
                <span className={styles.text}>Reset Cards</span>
            </button>

            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Reset All Cards"
                message="Are you sure you want to reset all cards to the original data? This will permanently remove all your custom cards and changes."
                confirmText="Reset Cards"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type="danger"
            />
        </>
    )
}

export default ResetButton
