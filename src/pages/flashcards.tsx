import React, { useState } from 'react'
import Layout from '@theme/Layout'
import FlashCardDeck from '@site/src/components/FlashCardDeck'
import { CodeEditor } from '@site/src/components/CodeEditor'
import { CodeEditorButton } from '@site/src/components/CodeEditorButton'
import CardEditorButton from '@site/src/components/CardEditorButton'
import ApiButton from '@site/src/components/ApiButton'
import ApiModal from '@site/src/components/ApiModal'
import useKeyboardShortcut from '@site/src/hooks/useKeyboardShortcut'

export default function FlashCardsPage(): React.ReactElement {
    const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [triggerAddCard, setTriggerAddCard] = useState(false)
    const [isApiModalOpen, setIsApiModalOpen] = useState(false)
    const [importedCards, setImportedCards] = useState<any[]>([])

    // Keyboard shortcut: Ctrl + Shift + C + D
    useKeyboardShortcut({
        keys: ['ctrl', 'shift', 'c', 'd'],
        onTriggered: () => setIsCodeEditorOpen((prev) => !prev),
        enabled: true,
    })

    // Keyboard shortcut for edit mode: Ctrl + Shift + E
    useKeyboardShortcut({
        keys: ['ctrl', 'shift', 'e'],
        onTriggered: () => setIsEditMode((prev) => !prev),
        enabled: true,
    })

    const handleAddCard = () => {
        setTriggerAddCard(true)
    }

    const handleAddCardTriggered = () => {
        setTriggerAddCard(false)
    }

    const handleDataImport = (cards: any[]) => {
        setImportedCards(cards)
    }

    const handleImportedCardsProcessed = () => {
        setImportedCards([])
    }

    return (
        <Layout
            title="Flash Cards"
            description="Interactive flash cards for learning tech concepts"
        >
            <FlashCardDeck
                isEditMode={isEditMode}
                onEditModeToggle={() => setIsEditMode((prev) => !prev)}
                triggerAddCard={triggerAddCard}
                onAddCardTriggered={handleAddCardTriggered}
                importedCards={importedCards}
                onImportedCardsProcessed={handleImportedCardsProcessed}
            />
            <CodeEditorButton
                onClick={() => setIsCodeEditorOpen((prev) => !prev)}
                isOpen={isCodeEditorOpen}
            />
            <ApiButton onClick={() => setIsApiModalOpen(true)} />
            <CardEditorButton onClick={handleAddCard} isVisible={isEditMode} />
            <CodeEditor
                isOpen={isCodeEditorOpen}
                onClose={() => setIsCodeEditorOpen(false)}
            />
            <ApiModal
                isOpen={isApiModalOpen}
                onClose={() => setIsApiModalOpen(false)}
                onDataImport={handleDataImport}
            />
        </Layout>
    )
}
