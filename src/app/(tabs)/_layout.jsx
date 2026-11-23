import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#15AD76',
        tabBarInactiveTintColor: '#7B898E',
        tabBarLabelStyle: {
          fontFamily: 'sans-serif',
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          borderTopColor: '#E4ECEA',
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          minWidth: 70,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
