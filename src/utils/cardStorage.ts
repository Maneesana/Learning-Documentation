export interface CardData {
    id: number
    title: string
    description: string
    category: string
    difficulty: string
    steps: {
        title: string
        description: string
        code?: string
    }[]
}

const STORAGE_KEY = 'flashcards_data'
const INITIAL_DATA_KEY = 'flashcards_initial_data'
const CATEGORIES_KEY = 'flashcards_categories'

export const saveCardsToLocalStorage = (cards: CardData[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    } catch (error) {
        console.error('Failed to save cards to localStorage:', error)
    }
}

export const loadCardsFromLocalStorage = (): CardData[] | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error('Failed to load cards from localStorage:', error)
        return null
    }
}

export const addCard = (cards: CardData[], newCard: CardData): CardData[] => {
    const updatedCards = [...cards, newCard]
    saveCardsToLocalStorage(updatedCards)
    return updatedCards
}

export const updateCard = (
    cards: CardData[],
    updatedCard: CardData
): CardData[] => {
    const updatedCards = cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
    )
    saveCardsToLocalStorage(updatedCards)
    return updatedCards
}

export const deleteCard = (cards: CardData[], cardId: number): CardData[] => {
    const updatedCards = cards.filter((card) => card.id !== cardId)
    saveCardsToLocalStorage(updatedCards)
    return updatedCards
}

export const generateUniqueId = (existingCards: CardData[]): number => {
    const maxId = existingCards.reduce((max, card) => Math.max(max, card.id), 0)
    return maxId + 1
}

export const saveInitialDataToLocalStorage = (cards: CardData[]): void => {
    try {
        localStorage.setItem(INITIAL_DATA_KEY, JSON.stringify(cards))
    } catch (error) {
        console.error('Failed to save initial data to localStorage:', error)
    }
}

export const loadInitialDataFromLocalStorage = (): CardData[] | null => {
    try {
        const stored = localStorage.getItem(INITIAL_DATA_KEY)
        return stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error('Failed to load initial data from localStorage:', error)
        return null
    }
}

export const resetToInitialData = (): CardData[] | null => {
    try {
        const initialData = loadInitialDataFromLocalStorage()
        if (initialData) {
            saveCardsToLocalStorage(initialData)
            return initialData
        }
        return null
    } catch (error) {
        console.error('Failed to reset to initial data:', error)
        return null
    }
}

export const saveCategoriesToLocalStorage = (categories: string[]): void => {
    try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    } catch (error) {
        console.error('Failed to save categories to localStorage:', error)
    }
}

export const loadCategoriesFromLocalStorage = (): string[] => {
    try {
        const stored = localStorage.getItem(CATEGORIES_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Failed to load categories from localStorage:', error)
        return []
    }
}

export const addNewCategory = (category: string): string[] => {
    const categories = loadCategoriesFromLocalStorage()
    if (!categories.includes(category)) {
        const updatedCategories = [...categories, category]
        saveCategoriesToLocalStorage(updatedCategories)
        return updatedCategories
    }
    return categories
}
