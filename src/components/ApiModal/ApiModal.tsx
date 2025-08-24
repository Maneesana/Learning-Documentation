import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ApiModal.module.css'

interface ApiModalProps {
    isOpen: boolean
    onClose: () => void
    onDataImport?: (importedCards: any[]) => void
}

interface ApiData {
    [key: string]: any
}

interface MappingState {
    [cardKey: string]: string | null
}

interface ValidationError {
    field: string
    message: string
}

const ApiModal: React.FC<ApiModalProps> = ({
    isOpen,
    onClose,
    onDataImport,
}) => {
    const [apiUrl, setApiUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [apiData, setApiData] = useState<ApiData[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [mapping, setMapping] = useState<MappingState>({
        id: null,
        title: null,
        description: null,
        category: null,
        difficulty: null,
        steps: null,
    })
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
        []
    )
    const [importSuccess, setImportSuccess] = useState(false)
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

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

    const fetchApiData = async () => {
        if (!apiUrl.trim()) {
            setError('Please enter a valid API URL')
            return
        }

        setIsLoading(true)
        setError(null)
        setApiData(null)

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(
                    `HTTP Error: ${response.status} - ${response.statusText}`
                )
            }

            const data = await response.json()

            // Ensure data is an array
            const dataArray = Array.isArray(data) ? data : [data]

            if (dataArray.length === 0) {
                throw new Error('API returned empty data')
            }

            setApiData(dataArray)
            setError(null)
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch data from API'
            setError(errorMessage)
            setApiData(null)
        } finally {
            setIsLoading(false)
        }
    }

    const getApiDataKeys = (): string[] => {
        if (!apiData || apiData.length === 0) return []

        // Get all unique keys from the first few objects, including nested paths
        const allKeys = new Set<string>()
        const sampleSize = Math.min(3, apiData.length)

        const traverseObject = (obj: any, currentPath: string = '') => {
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                Object.keys(obj).forEach((key) => {
                    const newPath = currentPath ? `${currentPath}.${key}` : key
                    allKeys.add(newPath)

                    // If this path is expanded, traverse deeper
                    if (
                        expandedPaths.has(newPath) &&
                        typeof obj[key] === 'object' &&
                        obj[key] !== null &&
                        !Array.isArray(obj[key])
                    ) {
                        traverseObject(obj[key], newPath)
                    }
                })
            }
        }

        for (let i = 0; i < sampleSize; i++) {
            traverseObject(apiData[i])
        }

        return Array.from(allKeys).sort()
    }

    const isObjectType = (obj: any, path: string): boolean => {
        const keys = path.split('.')
        let current = obj

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                return false
            }
        }

        return (
            current &&
            typeof current === 'object' &&
            !Array.isArray(current) &&
            current !== null
        )
    }

    const togglePathExpansion = (path: string) => {
        setExpandedPaths((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(path)) {
                // Collapse: remove this path and all nested paths
                const pathsToRemove = Array.from(newSet).filter((p: string) =>
                    p.startsWith(path + '.')
                )
                pathsToRemove.forEach((p) => newSet.delete(p))
                newSet.delete(path)
            } else {
                // Expand: add this path
                newSet.add(path)
            }
            return newSet
        })
    }

    const getValueByPath = (obj: any, path: string): any => {
        const keys = path.split('.')
        let current = obj

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                return undefined
            }
        }

        return current
    }

    const handleMappingChange = (cardKey: string, apiKey: string | null) => {
        setMapping((prev) => ({
            ...prev,
            [cardKey]: apiKey,
        }))

        // Clear validation errors for this field
        setValidationErrors((prev) =>
            prev.filter((err) => err.field !== cardKey)
        )
    }

    const validateMapping = (): boolean => {
        const errors: ValidationError[] = []
        const requiredFields = ['id', 'title', 'description']

        requiredFields.forEach((field) => {
            if (!mapping[field]) {
                errors.push({
                    field,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                })
            }
        })

        // Check for duplicate mappings
        const mappedValues = Object.values(mapping).filter(Boolean)
        const duplicates = mappedValues.filter(
            (value, index) => mappedValues.indexOf(value) !== index
        )

        if (duplicates.length > 0) {
            errors.push({
                field: 'general',
                message:
                    'Multiple card fields cannot map to the same API field',
            })
        }

        setValidationErrors(errors)
        return errors.length === 0
    }

    const transformData = () => {
        if (!apiData || !validateMapping()) return

        try {
            const transformedData = apiData.map((item, index) => ({
                id: mapping.id
                    ? getValueByPath(item, mapping.id) || index + 1
                    : index + 1,
                title: mapping.title
                    ? getValueByPath(item, mapping.title) || 'Untitled'
                    : 'Untitled',
                description: mapping.description
                    ? getValueByPath(item, mapping.description) ||
                      'No description'
                    : 'No description',
                category: mapping.category
                    ? getValueByPath(item, mapping.category) || 'General'
                    : 'General',
                difficulty: mapping.difficulty
                    ? getValueByPath(item, mapping.difficulty) || 'Beginner'
                    : 'Beginner',
                steps: mapping.steps
                    ? Array.isArray(getValueByPath(item, mapping.steps))
                        ? getValueByPath(item, mapping.steps)
                        : []
                    : [],
            }))

            console.log('Transformed data:', transformedData)

            // Call the import callback if provided
            if (onDataImport) {
                onDataImport(transformedData)
                setImportSuccess(true)
                // Close modal after a short delay to show success
                setTimeout(() => {
                    onClose()
                    setImportSuccess(false)
                }, 1500)
            } else {
                alert(
                    `Successfully transformed ${transformedData.length} items! (No import callback provided)`
                )
            }
        } catch (err) {
            setError('Failed to transform data. Please check your mappings.')
        }
    }

    const resetForm = () => {
        setApiUrl('')
        setApiData(null)
        setError(null)
        setImportSuccess(false)
        setExpandedPaths(new Set())
        setMapping({
            id: null,
            title: null,
            description: null,
            category: null,
            difficulty: null,
            steps: null,
        })
        setValidationErrors([])
    }

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
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: '0%', opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 120,
                            opacity: { duration: 0.2 },
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
                            {/* Step 1: API URL Input */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    1. Enter API Endpoint
                                </h3>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="url"
                                        value={apiUrl}
                                        onChange={(e) =>
                                            setApiUrl(e.target.value)
                                        }
                                        placeholder="https://api.example.com/data"
                                        className={styles.urlInput}
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={fetchApiData}
                                        disabled={isLoading || !apiUrl.trim()}
                                        className={styles.fetchButton}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span
                                                    className={styles.spinner}
                                                ></span>
                                                Fetching...
                                            </>
                                        ) : (
                                            'Fetch Data'
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <div className={styles.errorMessage}>
                                        <span className={styles.errorIcon}>
                                            ⚠️
                                        </span>
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Field Mapping (shown after successful fetch) */}
                            {apiData && (
                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>
                                        2. Map API Fields to Card Structure
                                    </h3>
                                    <div className={styles.mappingContainer}>
                                        <div className={styles.dataPreview}>
                                            <h4>Available API Fields</h4>
                                            <div className={styles.apiKeysGrid}>
                                                {getApiDataKeys().map((key) => {
                                                    const isObject =
                                                        apiData &&
                                                        isObjectType(
                                                            apiData[0],
                                                            key
                                                        )
                                                    const isExpanded =
                                                        expandedPaths.has(key)
                                                    const depth =
                                                        key.split('.').length -
                                                        1

                                                    return (
                                                        <div
                                                            key={key}
                                                            className={`${styles.apiKey} ${isObject ? styles.objectKey : ''}`}
                                                            style={{
                                                                marginLeft: `${depth * 12}px`,
                                                            }}
                                                        >
                                                            {isObject && (
                                                                <button
                                                                    onClick={() =>
                                                                        togglePathExpansion(
                                                                            key
                                                                        )
                                                                    }
                                                                    className={
                                                                        styles.expandButton
                                                                    }
                                                                    title={
                                                                        isExpanded
                                                                            ? 'Collapse object'
                                                                            : 'Expand object'
                                                                    }
                                                                >
                                                                    {isExpanded
                                                                        ? '▼'
                                                                        : '▶'}
                                                                </button>
                                                            )}
                                                            <span
                                                                className={
                                                                    styles.keyName
                                                                }
                                                            >
                                                                {key}
                                                                {isObject && (
                                                                    <span
                                                                        className={
                                                                            styles.objectIndicator
                                                                        }
                                                                    >
                                                                        {isExpanded
                                                                            ? ' {...}'
                                                                            : ' {object}'}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className={styles.sampleData}>
                                                <h5>Sample Data</h5>
                                                <pre
                                                    className={
                                                        styles.sampleCode
                                                    }
                                                >
                                                    {JSON.stringify(
                                                        apiData[0],
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className={styles.mappingFields}>
                                            <h4>Card Fields</h4>
                                            <div className={styles.mappingGrid}>
                                                {Object.keys(mapping).map(
                                                    (cardKey) => (
                                                        <div
                                                            key={cardKey}
                                                            className={
                                                                styles.mappingRow
                                                            }
                                                            data-field={cardKey}
                                                        >
                                                            <label
                                                                className={
                                                                    styles.fieldLabel
                                                                }
                                                            >
                                                                {cardKey}
                                                                {[
                                                                    'id',
                                                                    'title',
                                                                    'description',
                                                                ].includes(
                                                                    cardKey
                                                                ) && (
                                                                    <span
                                                                        className={
                                                                            styles.required
                                                                        }
                                                                    >
                                                                        *
                                                                    </span>
                                                                )}
                                                            </label>
                                                            <select
                                                                value={
                                                                    mapping[
                                                                        cardKey
                                                                    ] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleMappingChange(
                                                                        cardKey,
                                                                        e.target
                                                                            .value ||
                                                                            null
                                                                    )
                                                                }
                                                                className={
                                                                    styles.mappingSelect
                                                                }
                                                            >
                                                                <option value="">
                                                                    Select API
                                                                    field...
                                                                </option>
                                                                {getApiDataKeys().map(
                                                                    (
                                                                        apiKey
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                apiKey
                                                                            }
                                                                            value={
                                                                                apiKey
                                                                            }
                                                                        >
                                                                            {
                                                                                apiKey
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {validationErrors.find(
                                                                (err) =>
                                                                    err.field ===
                                                                    cardKey
                                                            ) && (
                                                                <div
                                                                    className={
                                                                        styles.fieldError
                                                                    }
                                                                >
                                                                    {
                                                                        validationErrors.find(
                                                                            (
                                                                                err
                                                                            ) =>
                                                                                err.field ===
                                                                                cardKey
                                                                        )
                                                                            ?.message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            {validationErrors.find(
                                                (err) => err.field === 'general'
                                            ) && (
                                                <div
                                                    className={
                                                        styles.generalError
                                                    }
                                                >
                                                    {
                                                        validationErrors.find(
                                                            (err) =>
                                                                err.field ===
                                                                'general'
                                                        )?.message
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Transform and Save (shown after mapping) */}
                            {apiData &&
                                Object.values(mapping).some(Boolean) && (
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>
                                            3. Transform & Import Data
                                        </h3>
                                        <div
                                            className={styles.transformSection}
                                        >
                                            {importSuccess ? (
                                                <div
                                                    className={
                                                        styles.successMessage
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.successIcon
                                                        }
                                                    >
                                                        ✅
                                                    </span>
                                                    Successfully imported{' '}
                                                    {apiData.length} flashcards!
                                                    Closing modal...
                                                </div>
                                            ) : (
                                                <>
                                                    <p
                                                        className={
                                                            styles.transformInfo
                                                        }
                                                    >
                                                        Ready to transform{' '}
                                                        {apiData.length} item(s)
                                                        from the API into
                                                        flashcards.
                                                    </p>
                                                    <div
                                                        className={
                                                            styles.actionButtons
                                                        }
                                                    >
                                                        <button
                                                            onClick={
                                                                transformData
                                                            }
                                                            className={
                                                                styles.transformButton
                                                            }
                                                            disabled={
                                                                validationErrors.length >
                                                                0
                                                            }
                                                        >
                                                            🔄 Transform &
                                                            Import Data
                                                        </button>
                                                        <button
                                                            onClick={resetForm}
                                                            className={
                                                                styles.resetButton
                                                            }
                                                        >
                                                            🔄 Reset Form
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Info Section */}
                            <div className={styles.infoSection}>
                                <details className={styles.helpDetails}>
                                    <summary className={styles.helpSummary}>
                                        📖 Expected Card Data Structure
                                    </summary>
                                    <div className={styles.codeContainer}>
                                        <pre className={styles.codeBlock}>
                                            <code>{cardDataStructure}</code>
                                        </pre>
                                    </div>
                                </details>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={styles.footer}>
                            <button
                                className={styles.secondaryButton}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            {apiData && (
                                <button
                                    className={styles.primaryButton}
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ApiModal
