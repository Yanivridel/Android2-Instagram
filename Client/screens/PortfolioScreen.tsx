import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView } from 'react-native';
import BackHeader from '@/components/BackHeader';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { Props } from '@/types/NavigationTypes';
import CryptoMarketCard from '@/components/CryptoMarketCard';
import {
  getIconByString,
  IC_BTCUSDT,
  IC_DOGEUSDT,
  IC_ETHUSDT,
  IC_Tothor_Logo_Only,
  IC_XRPUSDT,
} from '@/utils/constants/Icons';
import { Divider } from '@/components/ui/divider';
import { CryptoData, handleSQLiteSelect } from '@/utils/api/internal/sql/handleSQLite';
import { formatNumber } from '@/utils/functions/help';
import { PieChart } from 'react-native-gifted-charts';
import MyLinearGradient from '@/components/gradient/MyLinearGradient';
import CardUpRounded from '@/components/CardUpRounded';
import { dummyTrades } from '@/utils/constants/data';
import { useTranslation } from 'react-i18next';

interface PortfolioData {
  value: number;
  color: string;
  gradientCenterColor: string;
  symbol: string;
  amount: number;
  focused?: boolean;
}

const pieData: PortfolioData[] = [
  {
    value: 47,
    color: '#453ABD',
    gradientCenterColor: '#1A0DAB', // Deep blue with a rich contrast
    symbol: 'BTCUSDT',
    amount: 3000,
    focused: true,
  },
  {
    value: 40,
    color: '#7D8198',
    gradientCenterColor: '#2E2F38', // Dark charcoal for a bold metallic look
    symbol: 'ETHUSDT',
    amount: 2500,
  },
  {
    value: 16,
    color: '#FFB800',
    gradientCenterColor: '#FF4500', // Fiery orange to enhance the gold
    symbol: 'BNBUSDT',
    amount: 1200,
  },
  {
    value: 3,
    color: '#1C9ABB',
    gradientCenterColor: '#003366', // Deep ocean blue for sharp contrast
    symbol: 'XRPUSDT',
    amount: 500,
  },
];


function getAppropriateColor(currencyName: string) {
  const topCryptocurrencies = [
    { name: 'Available Money', color: 'purple' },
    { name: 'Bitcoin', symbol: 'BTC', color: '#f7931a' }, // Bitcoin Orange
    { name: 'Ethereum', symbol: 'ETH', color: '#3c3c3d' }, // Ethereum Gray
    { name: 'Tether', symbol: 'USDT', color: '#26a17b' }, // Tether Green
    { name: 'BNB', symbol: 'BNB', color: '#f3ba2f' }, // BNB Yellow
    { name: 'USD Coin', symbol: 'USDC', color: '#2775c9' }, // USD Coin Blue
    { name: 'XRP', symbol: 'XRP', color: '#006097' }, // Ripple Blue
    { name: 'Cardano', symbol: 'ADA', color: '#0033ad' }, // Cardano Blue
    { name: 'Solana', symbol: 'SOL', color: '#00ffa3' }, // Solana Green
    { name: 'Dogecoin', symbol: 'DOGE', color: '#c2a633' }, // Dogecoin Gold
    { name: 'Polkadot', symbol: 'DOT', color: '#e6007a' }, // Polkadot Pink
    { name: 'Shiba Inu', symbol: 'SHIB', color: '#fda32b' }, // Shiba Inu Orange
    { name: 'Litecoin', symbol: 'LTC', color: '#bfbbbb' }, // Litecoin Gray
    { name: 'Chainlink', symbol: 'LINK', color: '#2a5ada' }, // Chainlink Blue
    { name: 'Stellar', symbol: 'XLM', color: '#000000' }, // Stellar Black
    { name: 'USD Coin', symbol: 'USDC', color: '#2775c9' }, // USD Coin Blue
    { name: 'Avalanche', symbol: 'AVAX', color: '#e84142' }, // Avalanche Red
    { name: 'TRON', symbol: 'TRX', color: '#eb0029' }, // TRON Red
    { name: 'Uniswap', symbol: 'UNI', color: '#ff007a' }, // Uniswap Pink
    { name: 'Wrapped Bitcoin', symbol: 'WBTC', color: '#242d3d' }, // Wrapped Bitcoin Dark Blue
    { name: 'Dai', symbol: 'DAI', color: '#f4b731' }, // Dai Yellow
  ];
  const currency = topCryptocurrencies.find((crypto) => crypto.name === currencyName);
  return currency ? currency.color : 'grey';
}
const dummyQuickBuy = [IC_BTCUSDT, IC_ETHUSDT, IC_XRPUSDT, IC_DOGEUSDT, IC_Tothor_Logo_Only];

const PortfolioScreen = ({ navigation }: Props) => {
  const { appliedTheme } = useTheme();
  const { t } = useTranslation();
  const [selectedSlice, setSelectedSlice] = useState(pieData[0].symbol);

  const renderLegendComponent = () => {
    return (
      <FlatList
        data={pieData}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => item.color + idx}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <Pressable
            className="mr-5 flex-row items-center"
            onPress={() => setSelectedSlice(item.symbol)}>
            <Box
              className="mr-2.5 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Text className={`text-text-${appliedTheme}`}>
              {item.symbol}: {item.value}%
            </Text>
          </Pressable>
        )}
      />
    );
  };

  return (
    <ScrollView className={`flex-1 bg-background-${appliedTheme}`}>
      <MyLinearGradient
        type="background"
        color={appliedTheme === 'dark' ? 'blue' : 'purple'}
        className="h-[120px] p-4">
        <BackHeader title={t('portfolioScreen.portfolio')} colorScheme="alwaysWhite" />
      </MyLinearGradient>

      <CardUpRounded className={`flex flex-1 px-4 py-6`}>
        <Box className="mt-2 gap-1">
          <Text className={`text-3xl font-bold text-text-${appliedTheme}`}>{t('portfolioScreen.portfolioValue')}</Text>
          <Text className={`text-subText-${appliedTheme}`}>
              {t('portfolioScreen.spentMoreThanLastMonth', { amount: "$289.23" })}
          </Text>
        </Box>

        {/* Chart Container */}
        <Box className="m-3 flex-row justify-center">
          <PieChart
            data={pieData}
            donut
            showValuesAsLabels
            textSize={20}
            showGradient
            sectionAutoFocus
            focusOnPress
            focusedPieIndex={pieData.findIndex((item) => item.symbol === selectedSlice)}
            radius={120}
            innerRadius={80}
            innerCircleColor={appliedTheme === 'dark' ? '#161C2C' : '#FFFFFF'}
            extraRadius={9}
            centerLabelComponent={(idx: number) => {
              return (
                <Box className="items-center justify-center">
                  <Text className={`text-2xl font-bold text-text-${appliedTheme}`}>
                    {pieData[idx].symbol}
                  </Text>
                  <Text className={`text-2xl font-bold text-subText-${appliedTheme}`}>
                    {formatNumber(pieData[idx].amount)}
                  </Text>
                  <Text className={`font-semibold text-subTextGray-${appliedTheme} text-2xl`}>
                    {pieData[idx].value + '%'}
                  </Text>
                </Box>
              );
            }}
          />
        </Box>

        {/* Chart Details */}
        <Box className="my-2">{renderLegendComponent()}</Box>

        {/* Portfolio Value */}
        <Box className="my-3 gap-3">
          <Box className="flex-row justify-between">
            <Text className={`text-xl font-semibold text-text-${appliedTheme}`}>{t('portfolioScreen.market')}</Text>
            <Text
                className={`text-[#0A6CFF]`}
                onPress={() => navigation.navigate('MainApp', { screen: 'Markets' })}>
                {t('portfolioScreen.seeAll')}
            </Text>
          </Box>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dummyQuickBuy}
            keyExtractor={(item, idx) => String(idx)}
            renderItem={({ item: Icon }) => (
              <Pressable className="mx-3 flex-grow-0 items-center rounded-2xl bg-gray-200 p-4">
                <Icon className="h-12 w-12" />
              </Pressable>
            )}
          />
        </Box>

        {/* Transactions History */}
        <Box>
          <Box className="my-4 flex-row items-center justify-between">
            <Text className={`text-xl font-semibold text-text-${appliedTheme}`}>
                {t('portfolioScreen.transactionsHistory')}
            </Text>
            <Text
                className="text-[#0A6CFF]"
                onPress={() => {
                    navigation.navigate('MainApp', { screen: 'TradingHistory' });
                }}>
                {t('portfolioScreen.seeAll')}
            </Text>
          </Box>

          {/* Transactions History */}
          <Box className={`p-y-4 flex-1 rounded-lg bg-card-${appliedTheme}`}>
            <Box className="flex-row p-2">
              <Text className={`w-8 text-center text-text-${appliedTheme}`}> </Text>
              <Text className={`flex-1 self-center text-center text-text-${appliedTheme}`}>{t('portfolioScreen.price')}</Text>
              <Box className="items-between flex-1">
                  <Text className={`text-center text-text-${appliedTheme}`}>{t('portfolioScreen.amount')}</Text>
              </Box>
              <Text className={`flex-1 self-center text-center text-text-${appliedTheme}`}>{t('portfolioScreen.time')}</Text>
              <Text className={`flex-1 self-center text-center text-text-${appliedTheme}`}>{t('portfolioScreen.transaction')}</Text>
            </Box>

            {dummyTrades.slice(0, 3).map((item) => (
              <Box
                key={item.id.toString()}
                className={`flex-row items-center border-b p-3 ${
                  item.type === 'Buy' ? 'bg-green-900' : 'bg-red-900'}`}>
                <Box className="h-8 w-8">
                  {React.createElement(
                    getIconByString(`IC_${item.symbol.toUpperCase()}`) || IC_BTCUSDT
                  )}
                </Box>
                <Text className={`flex-1 text-center text-white`}>${item.price.toFixed(2)}</Text>
                <Text className={`flex-1 text-center text-white`}>{item.quantity}</Text>
                <Text className={`flex-1 text-center text-white`}>{item.time}</Text>
                <Text className={`flex-1 text-center text-white`}>{item.type}</Text>
              </Box>
            ))}

            {dummyTrades.length === 0 && (
              <Box className="py-10">
                <Text className="text-center text-gray-400">{t('portfolioScreen.noTradesFound')}</Text>
              </Box>
            )}
          </Box>
        </Box>
      </CardUpRounded>
    </ScrollView>
  );
};

export default PortfolioScreen;

/* Months
<Box className='mt-2'>
  <FlatList
  data={months}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item}
  contentContainerStyle={{ paddingHorizontal: 20 }}
  renderItem={({ item }) => {
    const isSelected = item === selectedMonth;
    return (
      <Pressable onPress={() => setSelectedMonth(item)} style={{ marginHorizontal: 10 }}>
        <Text 
        style={{
          fontSize: isSelected ? 22 : 17,
          fontWeight: isSelected ? 'bold' : 'normal',
          color: isSelected ? 'white' : '#a9afc2',
        }}>
          {item}
        </Text>
      </Pressable>
    );
  }}
  />
</Box> 
*/
