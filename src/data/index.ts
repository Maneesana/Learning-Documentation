import flashcards from "./flashcards.json"
import dataStructuresData from "./data_structures.json"
import { CardData } from "../components/CardFormModal"

function getFlashCardsData():CardData[]{
    const allData: CardData[] = [...dataStructuresData,...flashcards] as CardData[]
    
    allData.forEach(itm=> itm.id = crypto.randomUUID())
    return allData

}

export const flashcardsData:CardData[]  = getFlashCardsData()



