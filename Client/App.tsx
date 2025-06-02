import './global.css';
import 'react-native-gesture-handler';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import StackNavigator from '@screens/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './utils/Themes/ThemeProvider';
import { ToastProvider } from '@gluestack-ui/toast';
import 'react-native-get-random-values';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nManager } from 'react-native';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './store';

export default function App() {
  
  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
            <ThemeProvider>
              <PaperProvider>
                <GluestackUIProvider>
                  <ToastProvider>
                    <StackNavigator />
                    <StatusBar backgroundColor="#5506FD" barStyle="dark-content" />
                  </ToastProvider>
                </GluestackUIProvider>
              </PaperProvider>
            </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}