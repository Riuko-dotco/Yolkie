import { useState, useCallback } from "react"

type Background = { id: number; name: string; url: string}

const backgrounds: Background[] = [
    { id: 1, name: "Outside", url: "./images/insidehome.jpg" },
    { id: 2, name: "Inside", url: "./images/background.png" },
    { id: 3, name: "Playground", url: "./images/playground.jpg" },
]


export function useBackgroundChanger() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const prev = useCallback(() => {
        setCurrentIndex(i => (i - 1 + backgrounds.length) % backgrounds.length)
    }, [])

    const next = useCallback(() => {
        setCurrentIndex(i => (i + 1) % backgrounds.length)
    }, [])

    return {
        backgroundImage: `url(${backgrounds[currentIndex].url})`,
        prev,
        next,
    }
}
