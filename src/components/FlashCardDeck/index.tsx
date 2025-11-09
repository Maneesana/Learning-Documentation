import React, { useState, useEffect } from 'react'
import FlashCard from '../FlashCard'
import CardActionButtons from '../CardActionButtons'
import CardFormModal, { CardData } from '../CardFormModal'
import EditModeToggle from '../EditModeToggle'
import ResetButton from '../ResetButton'
import SaveButton from '../SaveButton'
import ConfirmDialog from '../ConfirmDialog'
import styles from './styles.module.css'
import { flashcardsData } from "../../data/index"
import {
    saveCardsToLocalStorage,
    loadCardsFromLocalStorage,
    saveInitialDataToLocalStorage,
    loadInitialDataFromLocalStorage,
    resetToInitialData,
    addCard,
    updateCard,
    deleteCard,
    generateUniqueId,
} from '../../utils/cardStorage'

interface FlashCardDeckProps {
    cards?: CardData[]
    isEditMode?: boolean
    onEditModeToggle?: () => void
    triggerAddCard?: boolean
    onAddCardTriggered?: () => void
    importedCards?: CardData[]
    onImportedCardsProcessed?: () => void
}

export default function FlashCardDeck({
    cards: initialCards,
    isEditMode = false,
    onEditModeToggle,
    triggerAddCard = false,
    onAddCardTriggered,
    importedCards,
    onImportedCardsProcessed,
}: FlashCardDeckProps): React.ReactElement {
    const [cards, setCards] = useState<CardData[]>([])
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCardFormOpen, setIsCardFormOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<CardData | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
        new Set()
    )
    const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [cardToDelete, setCardToDelete] = useState<number | null>(null)

    // Load cards from localStorage or use initial data
    useEffect(() => {
        const savedCards = loadCardsFromLocalStorage()
        const initialData = loadInitialDataFromLocalStorage()

        if (savedCards && savedCards.length > 0) {
            setCards(savedCards)
        } else if (initialCards && initialCards.length > 0) {
            setCards(initialCards)
            saveCardsToLocalStorage(initialCards)
            saveInitialDataToLocalStorage(initialCards)
        } else {
            const defaultCards = flashcardsData as CardData[]
            setCards(defaultCards)
            saveCardsToLocalStorage(defaultCards)
            // Only save initial data if it doesn't exist
            if (!initialData) {
                saveInitialDataToLocalStorage(defaultCards)
            }
        }
    }, [initialCards])

    // Handle external trigger for adding card
    useEffect(() => {
        if (triggerAddCard) {
            openCreateForm()
            if (onAddCardTriggered) {
                onAddCardTriggered()
            }
        }
    }, [triggerAddCard, onAddCardTriggered])

    // Handle imported cards from API
    useEffect(() => {
        if (importedCards && importedCards.length > 0) {
            // Add unique IDs to imported cards
            const cardsWithIds = importedCards.map((card) => ({
                ...card,
                id: generateUniqueId([
                    ...cards,
                    ...importedCards.slice(0, importedCards.indexOf(card)),
                ]),
            }))

            // Add imported cards to existing cards
            const updatedCards = [...cards, ...cardsWithIds]
            setCards(updatedCards)
            saveCardsToLocalStorage(updatedCards)

            // Notify parent that import has been processed
            if (onImportedCardsProcessed) {
                onImportedCardsProcessed()
            }
        }
    }, [importedCards, onImportedCardsProcessed])

    const handleCardSelect = (card: CardData) => {
        // Always open modal regardless of edit mode
        setSelectedCard(card)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedCard(null), 300) // Delay to allow animation
    }

    const handleCardSave = (card: CardData) => {
        if (formMode === 'create') {
            const newCard = { ...card, id: generateUniqueId(cards) }
            setCards(addCard(cards, newCard))
        } else {
            setCards(updateCard(cards, card))
        }
        setIsCardFormOpen(false)
        setEditingCard(null)
    }

    const handleCardEdit = (card: CardData) => {
        setEditingCard(card)
        setFormMode('edit')
        setIsCardFormOpen(true)
    }

    const handleCardDelete = (cardId: number) => {
        setCardToDelete(cardId)
        setDeleteConfirmOpen(true)
    }

    const confirmDeleteCard = () => {
        if (cardToDelete !== null) {
            setCards(deleteCard(cards, cardToDelete))
            setCardToDelete(null)
        }
        setDeleteConfirmOpen(false)
    }

    const cancelDeleteCard = () => {
        setCardToDelete(null)
        setDeleteConfirmOpen(false)
    }

    const openCreateForm = () => {
        setFormMode('create')
        setEditingCard(null)
        setIsCardFormOpen(true)
    }

    const toggleCategory = (category: string) => {
        const newCollapsed = new Set(collapsedCategories)
        if (newCollapsed.has(category)) {
            newCollapsed.delete(category)
        } else {
            newCollapsed.add(category)
        }
        setCollapsedCategories(newCollapsed)
    }

    const handleReset = () => {
	saveInitialDataToLocalStorage(flashcardsData)
        const resetCards = resetToInitialData()
        if (resetCards) {
            setCards(resetCards)
        }
    }

    const handleSave = () => {
        saveCardsToLocalStorage(cards)
    }

    // Group cards by category
    const cardsByCategory = cards.reduce(
        (acc, card) => {
            if (!acc[card.category]) {
                acc[card.category] = []
            }
            acc[card.category].push(card)
            return acc
        },
        {} as Record<string, CardData[]>
    )

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Tech Knowledge Cards</h1>
                    <p className={styles.subtitle}>
                        Click on any card to explore detailed information and
                        step-by-step guides
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <SaveButton onSave={handleSave} disabled={false} />
                    <EditModeToggle
                        isEditMode={isEditMode}
                        onToggle={onEditModeToggle || (() => {})}
                    />
                    <ResetButton onReset={handleReset} disabled={false} />
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.categorySection}>
                    {Object.entries(cardsByCategory).map(
                        ([category, categoryCards]: [string, CardData[]]) => (
                            <div
                                key={category}
                                className={styles.categoryGroup}
                            >
                                <button
                                    className={styles.categoryHeader}
                                    onClick={() => toggleCategory(category)}
                                    aria-expanded={
                                        !collapsedCategories.has(category)
                                    }
                                >
                                    <span className={styles.categoryTitle}>
                                        {category}
                                        <span className={styles.cardCount}>
                                            ({categoryCards.length} cards)
                                        </span>
                                    </span>
                                    <span
                                        className={`${styles.categoryArrow} ${collapsedCategories.has(category) ? styles.collapsed : ''}`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {!collapsedCategories.has(category) && (
                                    <div className={styles.cardGrid}>
                                        {categoryCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className={`${styles.cardWrapper} ${
                                                    selectedCard?.id === card.id
                                                        ? styles.selected
                                                        : ''
                                                } ${isEditMode ? styles.editMode : ''}`}
                                                onClick={() =>
                                                    handleCardSelect(card)
                                                }
                                                onMouseEnter={() =>
                                                    setHoveredCardId(card.id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredCardId(null)
                                                }
                                            >
                                                <FlashCard
                                                    title={card.title}
                                                    description={
                                                        card.description.slice(
                                                            0,
                                                            120
                                                        ) + '...'
                                                    }
                                                />
                                                <CardActionButtons
                                                    isVisible={
                                                        isEditMode &&
                                                        hoveredCardId ===
                                                            card.id
                                                    }
                                                    editMode={isEditMode}
                                                    onEdit={() =>
                                                        handleCardEdit(card)
                                                    }
                                                    onDelete={() =>
                                                        handleCardDelete(
                                                            card.id
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.modalCloseButton}
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>

                        {selectedCard && (
                            <div className={styles.detailContent}>
                                <div className={styles.detailHeader}>
                                    <h2 className={styles.detailTitle}>
                                        {selectedCard.title}
                                    </h2>
                                    <div className={styles.detailBadge}>
                                        {selectedCard.category}
                                    </div>
                                </div>
                                <div className={styles.detailBody}>
                                    <p className={styles.detailDescription}>
                                        {selectedCard.description}
                                    </p>
                                    <div className={styles.detailMeta}>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>
                                                Card ID:
                                            </span>
                                            <span className={styles.metaValue}>
                                                {selectedCard.id}
                                            </span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>
                                                Category:
                                            </span>
                                            <span className={styles.metaValue}>
                                                {selectedCard.category}
                                            </span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>
                                                Difficulty:
                                            </span>
                                            <span className={styles.metaValue}>
                                                {selectedCard.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.stepsSection}>
                                        <h3 className={styles.stepsTitle}>
                                            Step-by-Step Guide
                                        </h3>
                                        <div className={styles.stepsContainer}>
                                            {selectedCard.steps.map(
                                                (step, index) => (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles.stepItem
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.stepNumber
                                                            }
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.stepContent
                                                            }
                                                        >
                                                            <h4
                                                                className={
                                                                    styles.stepTitle
                                                                }
                                                            >
                                                                {step.title}
                                                            </h4>
                                                            <p
                                                                className={
                                                                    styles.stepDescription
                                                                }
                                                            >
                                                                {
                                                                    step.description
                                                                }
                                                            </p>
                                                            {step.code && (
                                                                <div
                                                                    className={
                                                                        styles.stepCode
                                                                    }
                                                                >
                                                                    <pre>
                                                                        <code>
                                                                            {
                                                                                step.code
                                                                            }
                                                                        </code>
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Card Form Modal */}
            <CardFormModal
                isOpen={isCardFormOpen}
                onClose={() => setIsCardFormOpen(false)}
                onSave={handleCardSave}
                card={editingCard}
                mode={formMode}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Delete Card"
                message="Are you sure you want to delete this card? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteCard}
                onCancel={cancelDeleteCard}
                type="danger"
            />
        </div>
    )
}
