export function truncateText(text: string, maxLength: number) {
    return text.slice(0, maxLength)
}

export function dependencies(...bins: string[]) {
    const missing = bins.filter((bin) =>
        Utils.exec({
            cmd: `which ${bin}`,
            out: () => false,
            err: () => true,
        }),
    )

    if (missing.length > 0) {
        console.warn(Error(`missing dependencies: ${missing.join(', ')}`))
    }

    return missing.length === 0
}
export function getByIndex(icons: any, keyIcon: number): string {
    const nearestKey = Object.keys(icons)
        .map(Number)
        .sort((a, b) => Number(b) - Number(a))
        .find((key) => keyIcon >= key)

    return nearestKey !== undefined ? icons[nearestKey] : ''
}
