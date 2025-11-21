
let dayOfMonthSlotterCache = null;

export const dayOfMonthSlotter = (date, node) => {

    let y = date.getUTCFullYear();
    let m = date.getUTCMonth();

    let cached = dayOfMonthSlotterCache;
    if (!cached || cached.y !== y || cached.m !== m) {
        let numDays = new Date(y, m+1, 0).getDate();
        let startIndex = new Date(y, m, 1).getDay();
        cached = {
            y, m,
            numDays,
            startIndex
        };
        dayOfMonthSlotterCache = cached;
    }

    const { numDays, startIndex } = cached;

    let lastDayOfMonth = numDays;

    let n = (
        ( ((node.row-1)*7) + node.column )
        - startIndex
    ); // example: -5 thru 36

    let outOfDayBounds = (n < 1 || n > lastDayOfMonth);
    let isDayOfMonth = !(outOfDayBounds);

    return {
        n: n,
        isDayOfMonth: isDayOfMonth
    };

};
