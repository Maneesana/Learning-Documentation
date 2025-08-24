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

export interface CardFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (card: CardData) => void
    card?: CardData | null
    mode: 'create' | 'edit'
}
