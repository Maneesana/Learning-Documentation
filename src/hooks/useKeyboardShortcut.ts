import { useEffect, useState } from 'react'

interface UseKeyboardShortcutProps {
    keys: string[]
    onTriggered: () => void
    enabled?: boolean
}

export const useKeyboardShortcut = ({
    keys,
    onTriggered,
    enabled = true,
}: UseKeyboardShortcutProps) => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            const newPressedKeys = new Set(pressedKeys)

            // Add special modifier keys
            if (event.ctrlKey || event.metaKey) newPressedKeys.add('ctrl')
            if (event.shiftKey) newPressedKeys.add('shift')
            if (event.altKey) newPressedKeys.add('alt')

            // Add the actual key pressed
            newPressedKeys.add(key)
            setPressedKeys(newPressedKeys)

            // Check if all required keys are pressed
            const allKeysPressed = keys.every((requiredKey) =>
                newPressedKeys.has(requiredKey.toLowerCase())
            )

            if (allKeysPressed) {
                event.preventDefault()
                event.stopPropagation()
                onTriggered()
                setPressedKeys(new Set()) // Reset after triggering
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            const newPressedKeys = new Set(pressedKeys)

            // Remove modifier keys when released
            if (!event.ctrlKey && !event.metaKey) newPressedKeys.delete('ctrl')
            if (!event.shiftKey) newPressedKeys.delete('shift')
            if (!event.altKey) newPressedKeys.delete('alt')

            // Remove the actual key
            newPressedKeys.delete(key)
            setPressedKeys(newPressedKeys)
        }

        // Reset on window blur
        const handleBlur = () => {
            setPressedKeys(new Set())
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        window.addEventListener('blur', handleBlur)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('blur', handleBlur)
        }
    }, [keys, onTriggered, enabled, pressedKeys])

    return pressedKeys
}

export default useKeyboardShortcut
