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
import { I18nextProvider } from 'react-i18next';
import { FirebaseAuth } from './FirebaseConfig';

export default function App() {

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = FirebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in:", user.email);
        // console.log("User: ", user);
        // maybe fetch your backend token again if needed
      } else {
        console.log("User not logged in");
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
          <ThemeProvider>
            <PaperProvider>
              <GluestackUIProvider>
                <ToastProvider>
                  <StackNavigator />
                  <StatusBar backgroundColor="#5506FD" barStyle="light-content" />
                </ToastProvider>
              </GluestackUIProvider>
            </PaperProvider>
          </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
