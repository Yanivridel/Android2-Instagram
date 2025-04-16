import { CandlestickData } from "@/components/market/CandleChart";
import axios from "axios";

const BINANCE_API_URL = "https://api.binance.com/api/v3";

interface InvestmentItem {
    amount: number;
    startDate: Date;
    endDate: Date;
}

interface ProfitResult {
    investedAmount: number;
    startDate: Date;
    endDate: Date;
    startTime: number;
    endTime: number;
    startPrice: number;
    endPrice: number;
    cryptoAmount: number;
    endValue: number;
    profit: number;
    profitPercentage: string;
}

export interface OverallProfitResult {
    symbol: string;
    totalInvested: number;
    totalProfit: number;
    roiPercentage: string;
    historicalData: CandlestickData[];
    individualResults: ProfitResult[];
}


/**
 * Determines the best interval based on the date range.
 * @param {number} startTime - Start time in milliseconds.
 * @param {number} endTime - End time in milliseconds.
 * @returns {string} - Binance Klines interval.
 */
const getBestInterval = (startTime: number, endTime: number): string => {
    const diffMs = endTime - startTime;
    const diffDays = diffMs / (1000 * 60 * 60 * 24); // Convert ms to days

    if (diffDays < 1 / 24) return "1m"; // Less than 1 hour → 1-minute interval
    if (diffDays < 0.25) return "5m"; // Less than 6 hours → 5-minute interval
    if (diffDays < 1) return "15m"; // Less than 24 hours → 15-minute interval
    if (diffDays < 7) return "1h"; // Less than a week → 1-hour interval
    if (diffDays < 30) return "4h"; // Less than a month → 4-hour interval
    if (diffDays < 90) return "1d"; // Less than 3 months → 1-day interval
    if (diffDays < 365) return "1w"; // Less than 1 year → 1-week interval
    return "1M"; // More than 1 year → 1-month interval
};


const calculateMultipleInvestmentsProfit = async (
    symbol: string,
    investments: InvestmentItem[]
): Promise<OverallProfitResult | null> => {
    try {
        if (investments.length === 0) return null;

        const startTimes = investments.map(item => new Date(item.startDate).getTime());
        const endTimes = investments.map(item => new Date(item.endDate).getTime());
        const earliestStart = Math.min(...startTimes);
        const latestEnd = Math.max(...endTimes);

        let totalInvested = 0;
        let totalProfit = 0;
        let individualResults: ProfitResult[] = [];

        for (const investment of investments) {
            const { amount, startDate, endDate } = investment;
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();

            const startResponse = await axios.get(`${BINANCE_API_URL}/klines`, {
                params: { symbol, interval: "1d", limit: 1, startTime }
            });
            if (startResponse.data.length === 0) continue;
            const startPrice = parseFloat(startResponse.data[0][4]);

            const endResponse = await axios.get(`${BINANCE_API_URL}/klines`, {
                params: { symbol, interval: "1d", limit: 1, startTime: endTime }
            });
            if (endResponse.data.length === 0) continue;
            const endPrice = parseFloat(endResponse.data[0][4]);

            const cryptoAmount = amount / startPrice;
            const endValue = cryptoAmount * endPrice;
            const profit = endValue - amount;
            const profitPercentage = ((profit / amount) * 100).toFixed(2);

            totalInvested += amount;
            totalProfit += profit;

            individualResults.push({
                investedAmount: amount,
                startDate,
                endDate,
                startTime,
                endTime,
                startPrice,
                endPrice,
                cryptoAmount,
                endValue,
                profit,
                profitPercentage,
            });
        }

        const roiPercentage = ((totalProfit / totalInvested) * 100).toFixed(2);
        const interval = getBestInterval(earliestStart, latestEnd);

        const historyResponse = await axios.get(`${BINANCE_API_URL}/klines`, {
            params: { symbol, interval, startTime: earliestStart, endTime: latestEnd }
        });
        const historicalData: CandlestickData[] = historyResponse.data.map((candle: any) => ({
            timestamp: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
        }));

        return {
            symbol,
            totalInvested,
            totalProfit,
            roiPercentage,
            historicalData,
            individualResults,
        };
    } catch (error: any) {
        console.error("Error fetching data:", error.message);
        return null;
    }
};

export default calculateMultipleInvestmentsProfit;
