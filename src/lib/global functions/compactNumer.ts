export const compactNumber = (numberToCompact: number) => {
    const language = 'it';
    let result;
    return result = Intl.NumberFormat(language, { notation: 'compact' }).format(numberToCompact);
}