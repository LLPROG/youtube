export const insertStringWithLinks = (inputString: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const outputHtml: string = inputString.replace(urlPattern, (matchedUrl: string) => {
        return `<a href="${matchedUrl}">${matchedUrl}</a>`;
    });
    return outputHtml.replace(/\n/g, '<br>');
}