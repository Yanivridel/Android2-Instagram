import React from "react";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { formatNumber } from "@/utils/functions/help";
import { useTranslation } from "react-i18next";

interface Order {
	price: number;
	amount: number;
}

interface BuySellOrderBookProps {
	orderBook: { bids: Order[]; asks: Order[] }; // ✅ WebSocket data from props
}

const BuySellOrderBook: React.FC<BuySellOrderBookProps> = ({ orderBook }) => {
	const { t } = useTranslation();

	const topAsks = orderBook.asks.slice(0, 6);
	const topBids = orderBook.bids.slice(0, 6);

	return (
		<Box className="px-4 h-full">
			{/* Header */}
			<Box className="flex-row justify-between pb-2 gap-4 border-b border-gray-700">
				<Box>
					<Text className="text-gray-400 text-sm">{t("orderBook.price")}</Text>
					<Text className="text-gray-400 text-sm">({t("orderBook.usdt")})</Text>
				</Box>
				<Box>
					<Text className="text-gray-400 text-sm">{t("orderBook.amount")}</Text>
					<Text className="text-gray-400 text-sm self-end">({t("orderBook.coin")})</Text>
				</Box>
			</Box>

			<Box className="flex-1 justify-between">
				{/* SELL ORDERS - Red */}
				<Box className="gap-1">
					{topAsks.map((ask, index) => (
						<Box key={`ask-${index}`} className="flex-row justify-between">
							<Text className="text-red-500">{formatNumber(Number(ask.price.toFixed(2)))}</Text>
							<Text className="text-gray-400">{ask.amount.toFixed(5)}</Text>
						</Box>
					))}
				</Box>

				{/* Mid Market Price */}
				<Box className="gap-[1px]">
					{topBids.length > 0 && topAsks.length > 0 && (
						<Box className="flex-col justify-center items-center py-1 border-t border-b border-gray-700">
							<Text className="text-green-500 text-xl font-bold">
								{topBids[0].price.toFixed(2)}
							</Text>
							<Text className="text-gray-500 font-medium text-lg">
								≈ ${topBids[0].price.toFixed(2)}
							</Text>
						</Box>
					)}
				</Box>

				{/* BUY ORDERS - Green */}
				<Box className="gap-1">
					{topBids.map((bid, index) => (
						<Box key={`bid-${index}`} className="flex-row justify-between">
							<Text className="text-green-500">{formatNumber(Number(bid.price.toFixed(2)))}</Text>
							<Text className="text-gray-400">{bid.amount.toFixed(5)}</Text>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default React.memo(BuySellOrderBook);
