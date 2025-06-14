import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { lazy, Suspense, useEffect, useState } from 'react';
import OverlayLoading from '@/components/OverlayLoading';
import React from 'react';

// 🚀 Lazy Load Screens (Except Settings, which loads instantly)

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
import CameraScreen from './post/CameraScreen';
import { ReduxInitializer } from '@/store/ReduxInitializer';
import MessageScreen from './chat/MessageScreen';
import PostComposerScreen from './post/PostComposerScreen';
import ChatScreen from './chat/ChatScreen';

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
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="PostComposer" component={PostComposerScreen} />

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
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="MessageScreen" component={MessageScreen} />
                <Stack.Screen name="test" component={testscreen} />

              </Stack.Navigator>
            </MemoizedLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
