
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

export function formatUsername(name: string): string {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "");
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function getTimeAgo(isoTime: string): string {
    const now = new Date();
    const past = new Date(isoTime);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 30) {
        return `just now`;
    }

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
}

export const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('/video/');
};