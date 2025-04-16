import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { formatNumber } from "@/utils/functions/help";
import { Text } from "./ui/text";
import { Box } from "./ui/box";

interface Order {
    price: number;
    amount: number;
}

interface OrderBookProps {
    orderBook: { bids: Order[]; asks: Order[] };
}

const OrderBook: React.FC<OrderBookProps> = ({ orderBook }) => {
    return (
        <Box className="pt-3 max-h-48">
            <ScrollView>
                {orderBook.bids.length === 0 && orderBook.asks.length === 0 ? (
                    <Text className="text-center text-gray-500">Loading order book...</Text>
                ) : (
                    orderBook.bids.map((bid, index) => (
                        <Box key={`bid-${index}`} className="flex-row justify-between py-1 items-center">
                            {/* Ask Side (Sellers) */}
                            <Text className="text-gray-500">{orderBook.asks[index]?.amount?.toFixed(5) || "-"}</Text>
                            <Text className="text-red-500">{formatNumber(Number(orderBook.asks[index]?.price?.toFixed(2))) || "-"}</Text>

                            {/* Bid Side (Buyers) */}
                            <Text className="text-green-500">{formatNumber(Number(bid.price.toFixed(2)))}</Text>
                            <Text className="text-gray-500">{bid.amount.toFixed(5)}</Text>
                        </Box>
                    ))
                )}
            </ScrollView>
        </Box>
    );
};

export default React.memo(OrderBook);
