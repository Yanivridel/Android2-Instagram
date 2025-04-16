import { useState } from 'react';
import { Box } from './ui/box';
import { Text } from './ui/text';
import {
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { IC_Arrow_Down, IC_Plus } from '@/utils/constants/Icons';
import InputAuth from './auth/InputAuth';
import { CryptoData } from '@/utils/api/internal/sql/handleSQLite';
import { formatSymbol } from '@/utils/functions/help';
import { Button, ButtonText } from './ui/button';
import { useTranslation } from 'react-i18next';

interface BuyNSellProps {
  coinData: CryptoData;
  onClose: () => void;
}

export default function BuyNSell({
  coinData,
  onClose,
}: BuyNSellProps) {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [buyOrSell, setBuyOrSell] = useState('Buy');
  const [USDTamount, setUSDTamount] = useState<string>('');
  const numericCurrencyValue = parseFloat(coinData.price || "0");
  const newCurrencyAmount = USDTamount
    ? (parseFloat(USDTamount) / numericCurrencyValue).toFixed(6)
    : '';

  const { appliedTheme } = useTheme();

  const selectOptions = [
    t('trade.selectType'),
    'Market',
    'FOK',
  ]
  const [selectedType, setSelectedType] = useState(selectOptions[0]);

  const userCurrentCurrency = 24; //! need to be fetch from the user
  const userCurrentUSDT = 2000000; //! need to be fetch from the user

  function handleBuying() {
    if (selectedType === '' || selectedType === t('trade.selectType')) {
      Alert.alert(t('trade.error.selectType'));
      return;
    }
    if (USDTamount === '' || USDTamount === '0') {
      Alert.alert(t('trade.error.enterAmount'));
      return;
    }
    if (buyOrSell === 'buy') {
      Alert.alert(
        t('trade.success.title', {
          action: t('trade.success.buy'),
          amount: newCurrencyAmount,
          symbol: coinData.symbol,
        })
      );
    } else {
      Alert.alert(
        t('trade.success.title', {
          action: t('trade.success.sell'),
          amount: newCurrencyAmount,
          symbol: coinData.symbol,
        })
      );
    }
    onClose();
  }

  function handleSetBuyOrSell(value: string) {
    setSelectedType('');
    setUSDTamount('');
    setBuyOrSell(value);
  }

  function handleUSDTamountChange(value: string) {
    const limit =
      buyOrSell === 'Buy'
        ? userCurrentUSDT
        : userCurrentCurrency * numericCurrencyValue;

    const alertMessage = t('trade.error.invalidAmount', { limit: limit.toFixed(2) });

    if (value[0] === '-') {
      Alert.alert(alertMessage);
      setUSDTamount('');
      return;
    }

    value = value.replace(/[^\d.]/g, '').replace(/\.(?=.*\.)/g, '');

    if (value === '' || value === '0') {
      setUSDTamount('');
      return;
    }
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      if (numericValue <= limit) {
        setUSDTamount(value);
      } else {
        setUSDTamount(limit.toFixed(2).toString());
        Alert.alert(alertMessage);
      }
    } else {
      Alert.alert(alertMessage);
    }
  }

  function handleUSDTIncrement() {
    const currentValue = parseFloat(USDTamount) || 0;
    const newValue = currentValue + 1;
    handleUSDTamountChange(newValue.toString());
  }

  function handleUSDTDecrement() {
    const currentValue = parseFloat(USDTamount) || 0;
    const newValue = Math.max(0, currentValue - 1);
    handleUSDTamountChange(newValue.toString());
  }

  function handleCurrencyIncrement() {
    const currentValue = parseFloat(newCurrencyAmount) || 0;
    const newValue = currentValue + 1;
    handleCurrentCurrencyAmountChange(newValue.toString());
  }

  function handleCurrencyDecrement() {
    const currentValue = parseFloat(newCurrencyAmount) || 0;
    const newValue = Math.max(0, currentValue - 1);
    handleCurrentCurrencyAmountChange(newValue.toString());
  }

  function handleCurrentCurrencyAmountChange(value: string) {
    const limit =
      buyOrSell === 'Buy'
        ? userCurrentUSDT / numericCurrencyValue
        : userCurrentCurrency;

    const alertMessage = t('trade.error.invalidAmount', { limit });

    if (value === '') {
      setUSDTamount('');
      return;
    }

    value = value.replace(/[^\d.]/g, '').replace(/\.(?=.*\.)/g, '');

    if (value[0] === '-') {
      Alert.alert(alertMessage);
      return;
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      if (numericValue <= limit) {
        setUSDTamount((numericValue * numericCurrencyValue).toFixed(2));
      } else {
        setUSDTamount((limit * numericCurrencyValue).toFixed(2));
        Alert.alert(alertMessage);
      }
    }
  }

  return (
    <TouchableWithoutFeedback accessible={false}>
      <Box className="h-full justify-between p-2" >
        <Box className='gap-4'>
          {/* Buy and Sell buttons */}
          <Box className="h-[50px] w-full flex-row justify-around p-2">
            {['Buy', 'Sell'].map((type, index) => (
              <TouchableOpacity
                key={type}
                className={`${buyOrSell === type
                  ? type === 'Buy' ? 'bg-green-500' : 'bg-red-500'
                  : `bg-background-${appliedTheme}`}
                  w-1/2 items-center justify-center ${index === 0 ? 'rounded-l-md' : 'rounded-r-md'}`}
                onPress={() => handleSetBuyOrSell(type)}
              >
                <Text className={buyOrSell === type ? 'text-white' : `text-text-${appliedTheme}`}>
                  {t(`trade.${type.toLowerCase()}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </Box>

          {/* transaction type input choosing */}
          <Box className="relative w-full z-10">
            <TouchableOpacity
              className={`flex-row items-center justify-between border border-gray-300 rounded-md px-2 h-[50px] bg-background-${appliedTheme}`}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text className={`text-text-${appliedTheme}`}>
                {selectedType || t('trade.selectType')}
              </Text>
              <IC_Arrow_Down color={appliedTheme === 'light' ? 'black' : 'white'} className='w-5 h-5' />
            </TouchableOpacity>
            {dropdownOpen && (
              <Box
                className={`absolute top-full left-0 w-full bg-card-${appliedTheme} border border-gray-300 rounded-md mt-1 max-h-[400px] overflow-hidden`}
              >
                {selectOptions.map((option: string, idx: number) => (
                  <TouchableOpacity
                    key={option}
                    className={`p-2 ${idx === 0 ? "bg-gray-200" : "bg-transparent"}`}
                    disabled={idx === 0}
                    onPress={() => {
                      setSelectedType(option);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text className={`text-subTextGray-${appliedTheme} ${idx === 0 ? "text-gray-400" : ""}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Box>
            )}
          </Box>

          {/* Price Input  */}
          <InputAuth
            classNameInput={`bg-background-${appliedTheme} mb-0 h-[50px] rounded-md`}
            type="numeric-control"
            placeholder={formatSymbol(coinData.symbol).split("/")[1]}
            value={USDTamount}
            onChangeText={handleUSDTamountChange}
            onIncrement={handleUSDTIncrement}
            onDecrement={handleUSDTDecrement}
          />
          {/* Amount Input */}
          <InputAuth
            classNameInput={`bg-background-${appliedTheme} mb-0 h-[50px] rounded-md`}
            type="numeric-control"
            placeholder={formatSymbol(coinData.symbol)}
            value={newCurrencyAmount}
            onChangeText={() => {}}
            onIncrement={handleCurrencyIncrement}
            onDecrement={handleCurrencyDecrement}
            isReadOnly={true}
          />
        </Box>

        <Box className='gap-2 mt-4'>
          <Box className='flex-row justify-between'>
            <Text className={`text-inputPlaceholderText-${appliedTheme}`}>{t('trade.available')}</Text>
            <Box className='flex-row gap-2 items-center'>
              <Text className={`text-inputPlaceholderText-${appliedTheme}`}>{formatSymbol(coinData.symbol).split("/")[1]}</Text>
              <Box className='bg-yellow-500 rounded-full p-1'>
                <IC_Plus className='h-4 w-4' color='black' />
              </Box>
            </Box>
          </Box>
          <Button
            className={`items-center rounded-lg p-4 h-fit ${buyOrSell === 'Buy' ? 'bg-green-500' : 'bg-red-500'}`}
            onPress={handleBuying}
          >
            <ButtonText className="text-white">{t(`trade.${buyOrSell.toLowerCase()}`)}</ButtonText>
          </Button>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
}
