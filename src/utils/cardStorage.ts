import { CardData } from '../components/CardFormModal'
import { PGlite } from '@electric-sql/pglite'
///// PGLite
export class FlashCardDB {
    private static DBInstance: PGlite | null = null

    static getInstance() {
        if (this.DBInstance !== null) return this.DBInstance
        if (this.DBInstance === null) {
            const db = new PGlite('idb://flash-card')
            return db
        }
    }
}

async function createFlashCardTable() {
    const db = FlashCardDB.getInstance()
    // create flash_card table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS flash_card
    (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    )

`)
}
/////

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

export const addCardV2_DB = async (newCard: CardData): Promise<void> => {
    console.log('New Card Data V2 database: ', newCard)
    await createFlashCardTable()

    // add flash card

    const db = FlashCardDB.getInstance()
    const res = await db.query(
        `
    INSERT INTO flash_card 
    (
        id,
        title,
        description
    )
    VALUES 
    (
        $1,
        $2,
        $3
    )
`,
        [newCard.id, newCard.title, newCard.description]
    )

    // Confirming after insert
    const savedCardOnDB = await db.exec(`SELECT * FROM flash_card;`)
    console.log({ savedCardOnDB })
}
export const addCard = (cards: CardData[], newCard: CardData): CardData[] => {
    const updatedCards = [...cards, newCard]
    saveCardsToLocalStorage(updatedCards)
    addCardV2_DB(newCard)
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

export const deleteCard = (
    cards: CardData[],
    cardId: string | number
): CardData[] => {
    const updatedCards = cards.filter((card) => card.id !== cardId)
    saveCardsToLocalStorage(updatedCards)
    return updatedCards
}

export const generateUniqueId = (existingCards: CardData[]): string => {
    return crypto.randomUUID()
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
