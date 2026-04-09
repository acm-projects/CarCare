import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fonts } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        

        tabBarStyle: {
          height: 70,
          justifyContent: 'center',
        },
        tabBarIconStyle: {
          width: '100%',
          marginBottom: 10,
          height: 55,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#3272ae', '#53c1f3']}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={{ flex: 1 }}
          />
        ),
      }}>
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'timeline',
          tabBarIcon: ({ focused }) => <Ionicons 
          name={focused ? "calendar" : "calendar-outline"} size={32} color='#fff' />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Ionicons 
          name={focused ? "car" : "car-outline"}  size={32} color='#fff' />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings',
          tabBarIcon: ({ focused }) => <Ionicons
           name={focused ? "settings" : "settings-outline"}  size={32} color='#fff' />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'chatbot',
          tabBarIcon: ({ focused }) => <Ionicons 
          name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={32} color='#fff' />,
        }}
      />
    </Tabs>
    
  );
}
