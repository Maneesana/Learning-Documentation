import React from 'react'
import { Tab } from './types'
import styles from './TabBar.module.css'

interface TabBarProps {
    tabs: Tab[]
    activeTabId: string
    onTabSelect: (tabId: string) => void
    onTabClose: (tabId: string) => void
}

const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTabId,
    onTabSelect,
    onTabClose,
}) => {
    return (
        <div className={styles.tabBar}>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
                    onClick={() => onTabSelect(tab.id)}
                >
                    <span className={styles.tabName}>
                        {tab.name}
                        {tab.isDirty && (
                            <span className={styles.dirtyIndicator}>●</span>
                        )}
                    </span>
                    <button
                        className={styles.closeButton}
                        onClick={(e) => {
                            e.stopPropagation()
                            onTabClose(tab.id)
                        }}
                        title="Close tab"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}

export default TabBar
