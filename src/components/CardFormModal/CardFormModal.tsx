import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardFormModalProps, CardData } from './types'
import {
    loadCategoriesFromLocalStorage,
    addNewCategory,
    saveCategoriesToLocalStorage,
} from '../../utils/cardStorage'
import styles from './CardFormModal.module.css'

const DEFAULT_CATEGORIES = [
    'React',
    'JavaScript',
    'TypeScript',
    'CSS',
    'HTML',
    'Node.js',
    'Python',
    'Algorithms',
    'Data Structures',
    'System Design',
    'Other',
]

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const CardFormModal: React.FC<CardFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    card,
    mode,
}) => {
    const [formData, setFormData] = useState<CardData>({
        id: 0,
        title: '',
        description: '',
        category: 'React',
        difficulty: 'Beginner',
        steps: [{ title: '', description: '', code: '' }],
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    // Load categories from localStorage
    useEffect(() => {
        const savedCategories = loadCategoriesFromLocalStorage()
        if (savedCategories.length > 0) {
            // Merge default categories with saved ones, removing duplicates
            const allCategories = [
                ...new Set([...DEFAULT_CATEGORIES, ...savedCategories]),
            ]
            setCategories(allCategories)
        }
    }, [])

    useEffect(() => {
        if (card && mode === 'edit') {
            setFormData(card)
        } else if (mode === 'create') {
            setFormData({
                id: Date.now(), // Generate a unique ID
                title: '',
                description: '',
                category: 'React',
                difficulty: 'Beginner',
                steps: [{ title: '', description: '', code: '' }],
            })
        }
        setErrors({})
    }, [card, mode, isOpen])

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }

        if (formData.steps.length === 0) {
            newErrors.steps = 'At least one step is required'
        } else {
            const hasValidStep = formData.steps.some(
                (step) => step.title.trim() && step.description.trim()
            )
            if (!hasValidStep) {
                newErrors.steps =
                    'At least one step must have title and description'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            // Filter out empty steps
            const validSteps = formData.steps.filter(
                (step) => step.title.trim() && step.description.trim()
            )

            onSave({
                ...formData,
                steps: validSteps,
            })
            onClose()
        }
    }

    const handleInputChange = (field: keyof CardData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const handleStepChange = (
        index: number,
        field: keyof CardData['steps'][0],
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            steps: prev.steps.map((step, i) =>
                i === index ? { ...step, [field]: value } : step
            ),
        }))
        if (errors.steps) {
            setErrors((prev) => ({ ...prev, steps: '' }))
        }
    }

    const addStep = () => {
        setFormData((prev) => ({
            ...prev,
            steps: [...prev.steps, { title: '', description: '', code: '' }],
        }))
    }

    const removeStep = (index: number) => {
        if (formData.steps.length > 1) {
            setFormData((prev) => ({
                ...prev,
                steps: prev.steps.filter((_, i) => i !== index),
            }))
        }
    }

    const handleAddCategory = () => {
        if (
            newCategoryName.trim() &&
            !categories.includes(newCategoryName.trim())
        ) {
            const updatedCategories = addNewCategory(newCategoryName.trim())
            setCategories([
                ...new Set([...DEFAULT_CATEGORIES, ...updatedCategories]),
            ])
            setFormData((prev) => ({
                ...prev,
                category: newCategoryName.trim(),
            }))
            setNewCategoryName('')
            setIsAddingCategory(false)
        }
    }

    const handleCancelAddCategory = () => {
        setNewCategoryName('')
        setIsAddingCategory(false)
    }

    const handleCategoryChange = (value: string) => {
        if (value === '+ Add Category') {
            setIsAddingCategory(true)
        } else {
            handleInputChange('category', value)
        }
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
                            <h2 className={styles.title}>
                                {mode === 'create'
                                    ? 'Create New Card'
                                    : 'Edit Card'}
                            </h2>
                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                                type="button"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formContent}>
                                {/* Basic Info Section */}
                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>
                                        Basic Information
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Title{' '}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'title',
                                                    e.target.value
                                                )
                                            }
                                            className={`${styles.input} ${errors.title ? styles.error : ''}`}
                                            placeholder="Enter card title..."
                                        />
                                        {errors.title && (
                                            <span className={styles.errorText}>
                                                {errors.title}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Description{' '}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                                            placeholder="Enter detailed description..."
                                            rows={3}
                                        />
                                        {errors.description && (
                                            <span className={styles.errorText}>
                                                {errors.description}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>
                                                Category
                                            </label>
                                            {isAddingCategory ? (
                                                <div
                                                    className={
                                                        styles.addCategoryContainer
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={(e) =>
                                                            setNewCategoryName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={styles.input}
                                                        placeholder="Enter new category name..."
                                                        autoFocus
                                                        onKeyPress={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Enter'
                                                            ) {
                                                                handleAddCategory()
                                                            } else if (
                                                                e.key ===
                                                                'Escape'
                                                            ) {
                                                                handleCancelAddCategory()
                                                            }
                                                        }}
                                                    />
                                                    <div
                                                        className={
                                                            styles.addCategoryButtons
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleAddCategory
                                                            }
                                                            className={
                                                                styles.addCategoryButton
                                                            }
                                                            disabled={
                                                                !newCategoryName.trim()
                                                            }
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancelAddCategory
                                                            }
                                                            className={
                                                                styles.cancelCategoryButton
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) =>
                                                        handleCategoryChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={styles.select}
                                                >
                                                    {categories.map((cat) => (
                                                        <option
                                                            key={cat}
                                                            value={cat}
                                                        >
                                                            {cat}
                                                        </option>
                                                    ))}
                                                    <option value="+ Add Category">
                                                        + Add Category
                                                    </option>
                                                </select>
                                            )}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>
                                                Difficulty
                                            </label>
                                            <select
                                                value={formData.difficulty}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'difficulty',
                                                        e.target.value
                                                    )
                                                }
                                                className={styles.select}
                                            >
                                                {DIFFICULTIES.map((diff) => (
                                                    <option
                                                        key={diff}
                                                        value={diff}
                                                    >
                                                        {diff}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Steps Section */}
                                <div className={styles.section}>
                                    <div className={styles.sectionHeader}>
                                        <h3 className={styles.sectionTitle}>
                                            Steps{' '}
                                            <span className={styles.required}>
                                                *
                                            </span>
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addStep}
                                            className={styles.addStepButton}
                                        >
                                            + Add Step
                                        </button>
                                    </div>
                                    {errors.steps && (
                                        <span className={styles.errorText}>
                                            {errors.steps}
                                        </span>
                                    )}

                                    <div className={styles.stepsContainer}>
                                        {formData.steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className={styles.stepItem}
                                            >
                                                <div
                                                    className={
                                                        styles.stepHeader
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.stepNumber
                                                        }
                                                    >
                                                        Step {index + 1}
                                                    </span>
                                                    {formData.steps.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeStep(
                                                                    index
                                                                )
                                                            }
                                                            className={
                                                                styles.removeStepButton
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.stepContent
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.formGroup
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                styles.label
                                                            }
                                                        >
                                                            Step Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={step.title}
                                                            onChange={(e) =>
                                                                handleStepChange(
                                                                    index,
                                                                    'title',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                styles.input
                                                            }
                                                            placeholder="Enter step title..."
                                                        />
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.formGroup
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                styles.label
                                                            }
                                                        >
                                                            Step Description
                                                        </label>
                                                        <textarea
                                                            value={
                                                                step.description
                                                            }
                                                            onChange={(e) =>
                                                                handleStepChange(
                                                                    index,
                                                                    'description',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                styles.textarea
                                                            }
                                                            placeholder="Enter step description..."
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.formGroup
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                styles.label
                                                            }
                                                        >
                                                            Code (Optional)
                                                        </label>
                                                        <textarea
                                                            value={
                                                                step.code || ''
                                                            }
                                                            onChange={(e) =>
                                                                handleStepChange(
                                                                    index,
                                                                    'code',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`${styles.textarea} ${styles.codeTextarea}`}
                                                            placeholder="Enter code example..."
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add Category Section */}
                                {isAddingCategory && (
                                    <div className={styles.addCategorySection}>
                                        <h3 className={styles.sectionTitle}>
                                            Add New Category
                                        </h3>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) =>
                                                    setNewCategoryName(
                                                        e.target.value
                                                    )
                                                }
                                                className={`${styles.input} ${errors.title ? styles.error : ''}`}
                                                placeholder="Enter new category name..."
                                            />
                                            {errors.title && (
                                                <span
                                                    className={styles.errorText}
                                                >
                                                    {errors.title}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.formActions}>
                                            <button
                                                type="button"
                                                onClick={handleAddCategory}
                                                className={styles.saveButton}
                                            >
                                                Add Category
                                            </button>
                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancelAddCategory
                                                }
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className={styles.footer}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                >
                                    {mode === 'create'
                                        ? 'Create Card'
                                        : 'Update Card'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CardFormModal
