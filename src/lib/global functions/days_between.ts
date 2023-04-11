export const daysBetween = (date1: Date) => {

    const date2 = new Date()
    const ONE_SEC = 1000;
    const ONE_HOUR = 1000 * 60 * 60;
    const ONE_MIN = 1000 * 60;
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const date1Formatted = new Date(date1);

    // Convert both dates to milliseconds
    const date1_ms = date1Formatted.getTime();
    const date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    const difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    const deltaSec = Math.round(difference_ms / ONE_SEC);
    const deltaMin = Math.round(difference_ms / ONE_MIN);
    const deltaHour = Math.round(difference_ms / ONE_HOUR)
    let deltaDays = Math.round(difference_ms / ONE_DAY);

    const rtf1 = new Intl.RelativeTimeFormat('it');

    let result;

    if (deltaSec < 60) {
        result = rtf1.format(-deltaSec, 'second');
    } else if (deltaMin < 60) {
        result = rtf1.format(-deltaMin, 'minute');
    } else if (deltaHour < 24) {
        result = rtf1.format(-deltaHour, 'hour');
    } else if (deltaDays < 32) {
        result = rtf1.format(-deltaDays, 'day');
    } else if (deltaDays > 31 && deltaDays < 366) {
        deltaDays = Math.round(deltaDays / 31);
        result = rtf1.format(-deltaDays, 'month');
    } else {
        deltaDays = Math.round(deltaDays / 365);
        result = rtf1.format(-deltaDays, 'year');
    }

    return result;
}