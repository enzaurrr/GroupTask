import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F4F1EA',
        tabBarInactiveTintColor: '#C2C8A4',
        tabBarStyle: {
          backgroundColor: '#262C14',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Menu' }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Cart' }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}
