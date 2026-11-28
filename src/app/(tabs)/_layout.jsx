import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Record<'home' | 'explore' | 'practice' | 'profile', [IoniconName, IoniconName]>} */
const icons = {
  home: ['home', 'home-outline'],
  explore: ['search', 'search-outline'],
  practice: ['school', 'school-outline'],
  profile: ['person', 'person-outline'],
};

/**
 * @param {{ color: import('react-native').ColorValue, focused: boolean, name: keyof typeof icons, size: number }} props
 */
function TabIcon({ color, focused, name, size }) {
  const [activeIcon, inactiveIcon] = icons[name];

  return (
    <Ionicons
      color={typeof color === 'string' ? color : '#7B898E'}
      name={focused ? activeIcon : inactiveIcon}
      size={size}
    />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12) + 8;

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
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E4ECEA',
          borderTopWidth: 1,
          elevation: 10,
          height: 62 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          shadowColor: '#12332E',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          minWidth: 70,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: (props) => <TabIcon {...props} name="home" />,
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: (props) => <TabIcon {...props} name="explore" />,
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          tabBarIcon: (props) => <TabIcon {...props} name="practice" />,
          title: 'Practice',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: (props) => <TabIcon {...props} name="profile" />,
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
