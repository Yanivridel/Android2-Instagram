import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { lazy, Suspense, useEffect, useState } from 'react';
import OverlayLoading from '@/components/OverlayLoading';
import React from 'react';

// 🚀 Lazy Load Screens (Except Settings, which loads instantly)
const ChatScreen = lazy(() => import('./chat/ChatScreen'));

// 📌 Regular Imports (SettingsScreen Now Loads Instantly)
import HomeScreen from './home/HomeScreen';
import ExploreScreen from './ExploreScreen';
import LeaderboardScreen from './LeaderboardScreen';
import NotificationsScreen from './home/NotificationsScreen';
import ProfileScreen from './Profile/ProfileScreen';
import Layout from './Layout';
import Login from './auth/Login';
import Signup from './auth/Signup';

import testscreen from './testscreen';
import PostScreen from './post/PostScreen';
import { ReduxInitializer } from '@/store/ReduxInitializer';
import MessageScreen from './chat/MessageScreen';

const MemoizedLayout = React.memo(Layout);

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <ReduxInitializer />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          detachPreviousScreen: true,
          headerShown: false,
        }}
      
      >
        {/* 🏆 Auth Screens */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Post" component={PostScreen} />

        {/* 🏆 Main App with Layout */}
        <Stack.Screen name="MainApp" options={{ headerShown: false }}>
          {({ navigation }) => (
            <MemoizedLayout navigation={navigation}>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  detachPreviousScreen: true,
                }}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Explore" component={ExploreScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                <Stack.Screen name="MessageScreen" component={MessageScreen} />
                {/* <Stack.Screen name="Post" component={PostScreen} /> */}
                <Stack.Screen name="test" component={testscreen} />

                {/* 🚀 Lazy Loaded Screens (Except Settings) */}
                <Stack.Screen name="Chat">
                  {() => (
                    <Suspense fallback={<OverlayLoading />}>
                      <ChatScreen navigation={navigation} />
                    </Suspense>
                  )}
                </Stack.Screen>

              </Stack.Navigator>
            </MemoizedLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
