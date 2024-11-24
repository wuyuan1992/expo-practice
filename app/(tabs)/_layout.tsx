import { Link, Tabs } from 'expo-router';
import { Button, useTheme } from 'tamagui';
import { Atom, AudioWaveform } from '@tamagui/lucide-icons';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="tab_2048"
        options={{
          title: '2048',
          tabBarIcon: ({ color }) => <Atom color={color} />,
          headerRight: () => (
            <Link href="/modals/GameSaves" asChild>
              <Button mr="$4" bg="$purple8" color="$purple12">
                Game Saves
              </Button>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="tab_sudoku"
        options={{
          title: 'Sudoku',
          tabBarIcon: ({ color }) => <AudioWaveform color={color} />,
        }}
      />
    </Tabs>
  );
}
