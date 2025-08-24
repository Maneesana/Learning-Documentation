import React, { useMemo } from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

interface FlashCardProps {
    title: string
    description: string
    className?: string
}

export default function FlashCard({
    title,
    description,
    className,
}: FlashCardProps): React.ReactElement {
    const randomColor = useMemo(() => {
        const colors = [
            'rgba(139, 69, 19, 0.1)', // Brown
            'rgba(255, 20, 147, 0.1)', // Deep Pink
            'rgba(30, 144, 255, 0.1)', // Dodger Blue
            'rgba(50, 205, 50, 0.1)', // Lime Green
            'rgba(255, 165, 0, 0.1)', // Orange
            'rgba(147, 112, 219, 0.1)', // Medium Purple
            'rgba(220, 20, 60, 0.1)', // Crimson
            'rgba(0, 206, 209, 0.1)', // Dark Turquoise
            'rgba(255, 215, 0, 0.1)', // Gold
            'rgba(106, 90, 205, 0.1)', // Slate Blue
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }, [])

    return (
        <div
            className={clsx(styles.card, className)}
            style={{ backgroundColor: randomColor }}
        >
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{title}</h3>
            </div>
            <div className={styles.cardBody}>
                <p className={styles.cardDescription}>{description}</p>
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.cardAccent}></div>
            </div>
        </div>
    )
}
