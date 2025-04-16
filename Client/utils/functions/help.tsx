
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
    ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function(this: any, ...args: Parameters<T>) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

export const convertBirthday = (birthday: string) => {
    const parts = birthday.split(" / ");
    const [month, day, year] = parts.map(Number);
    return new Date(year, month - 1, day);
};

export const formatNumber = (num: number, decimals = 2) => {
    const roundedNum = num.toFixed(decimals);
    return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(parseFloat(roundedNum));
};

export const formatSymbol = (symbol: string) => {
    const quoteCurrencies = ["USDT", "USD", "BTC", "ETH", "BNB", "EUR"];

    for (let quote of quoteCurrencies) {
        if (symbol.endsWith(quote)) {
            const base = symbol.slice(0, -quote.length);
            return `${base}-${quote}`;
        }
    }
    return symbol;
};