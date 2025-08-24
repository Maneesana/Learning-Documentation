import React from 'react'
import styles from './ApiButton.module.css'

interface ApiButtonProps {
    onClick: () => void
}

const ApiButton: React.FC<ApiButtonProps> = ({ onClick }) => {
    return (
        <button
            className={styles.apiButton}
            onClick={onClick}
            title="Fetch External API Data (Coming Soon)"
            aria-label="Fetch External API Data"
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
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
            </svg>
            <span className={styles.text}>API Data</span>
        </button>
    )
}

export default ApiButton
