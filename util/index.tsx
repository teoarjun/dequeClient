export const getPublishedDate = (datesArray: string[], isOldest = true) => {
    //1. getMostPopularAuthor
    let oldestString = datesArray[0]; // Assume the first element is the oldest string
    for (let i = 1; i < datesArray.length; i++) {
        const currentDate = new Date(datesArray[i]);
        if (datesArray[i] && !isNaN(currentDate.getTime()) && currentDate.getFullYear() > 1000) {
            const oldestDate = new Date(oldestString);
            /* istanbul ignore else if */
            if (isOldest && currentDate < oldestDate) {
                oldestString = datesArray[i];
            }
            else if (!isOldest && currentDate > oldestDate) {
                oldestString = datesArray[i];
            }
        }
    }
    return oldestString;
}

export const findMostRepeatedElement = (arr: string[]) => {
    const countMap = new Map<string, number>();

    // Count the occurrences of each element in the array
    for (const item of arr) {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    }

    let mostRepeatedElement: string | undefined;
    let maxCount = 0;

    // Find the element with the maximum count
    for (const [item, count] of countMap.entries()) {
        if (count > maxCount) {
            mostRepeatedElement = item;
            maxCount = count;
        }
    }

    return mostRepeatedElement;
}