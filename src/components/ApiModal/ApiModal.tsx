import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ApiModal.module.css'

interface ApiModalProps {
    isOpen: boolean
    onClose: () => void
}

const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
    const cardDataStructure = `{
  "id": 1,
  "title": "React Hooks",
  "description": "React Hooks are functions that let you use state and other React features without writing a class component. They were introduced in React 16.8 and have revolutionized how we write React applications.",
  "category": "React",
  "difficulty": "Intermediate",
  "steps": [
    {
      "title": "Import useState",
      "description": "Import the useState hook from React",
      "code": "import React, { useState } from 'react'"
    },
    {
      "title": "Declare State Variable", 
      "description": "Use useState to create a state variable and setter function",
      "code": "const [count, setCount] = useState(0)"
    },
    {
      "title": "Update State",
      "description": "Use the setter function to update state",
      "code": "setCount(count + 1)"
    },
    {
      "title": "Use in JSX",
      "description": "Display the state value in your component", 
      "code": "<button onClick={() => setCount(count + 1)}>Count: {count}</button>"
    }
  ]
}`

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className={styles.modalContainer}
                        initial={{ x: '100%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 100,
                        }}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.titleContainer}>
                                <div className={styles.iconContainer}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={styles.headerIcon}
                                    >
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                                    </svg>
                                </div>
                                <h2 className={styles.title}>
                                    External API Integration
                                </h2>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div className={styles.content}>
                            <div className={styles.comingSoonBadge}>
                                <span className={styles.badge}>
                                    🚀 Coming Soon
                                </span>
                            </div>

                            <div className={styles.description}>
                                <h3>External API Data Loading</h3>
                                <p>
                                    This feature will allow you to load
                                    flashcard data from external public APIs!
                                    You'll be able to fetch educational content
                                    from various sources and seamlessly
                                    integrate it with our interactive card
                                    system.
                                </p>
                            </div>

                            <div className={styles.features}>
                                <h4>Planned Features:</h4>
                                <ul>
                                    <li>
                                        🌐 Support for multiple API endpoints
                                    </li>
                                    <li>🔄 Automatic data transformation</li>
                                    <li>💾 Local caching and storage</li>
                                    <li>🎯 Smart categorization</li>
                                    <li>⚡ Real-time updates</li>
                                </ul>
                            </div>

                            <div className={styles.dataStructure}>
                                <h4>Expected Card Data Structure:</h4>
                                <div className={styles.codeContainer}>
                                    <pre className={styles.codeBlock}>
                                        <code>{cardDataStructure}</code>
                                    </pre>
                                </div>
                                <p className={styles.note}>
                                    <strong>Note:</strong> Your API should
                                    return data in this format, or we'll provide
                                    transformation tools to convert your data
                                    structure.
                                </p>
                            </div>

                            <div className={styles.subscribe}>
                                <h4>Stay Updated!</h4>
                                <p>
                                    This feature is actively being developed.
                                    Follow our progress and get notified when
                                    it's ready!
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={styles.footer}>
                            <button
                                className={styles.primaryButton}
                                onClick={onClose}
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ApiModal
