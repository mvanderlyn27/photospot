export const round = (num: number, digits: number | null) => {
    if (digits === null || num === undefined) {
        return num;
    }
    return Number(num.toFixed(digits));
}
export const randomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
}