export const getPublishedDate = (datesArray: string[], isOldest = true) => {
    //1. getMostPopularAuthor
    let oldestString = datesArray[0]; // Assume the first element is the oldest string
    for (let i = 1; i < datesArray.length; i++) {
        const currentDate = new Date(datesArray[i]);
        if (datesArray[i] && !isNaN(currentDate.getTime()) && currentDate.getFullYear() > 1000) {
            const oldestDate = new Date(oldestString);
            if (isOldest && currentDate < oldestDate) {
                oldestString = datesArray[i];
            } else if (!isOldest && currentDate > oldestDate) {
                oldestString = datesArray[i];
            }
        }
    }
    return oldestString;
}