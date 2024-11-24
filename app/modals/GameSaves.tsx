import { View, XStack } from 'tamagui';
import GameSaves from 'components/biz/2048/GameSaves';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

function GameSavesModal() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Game Saves' });
  }, [navigation]);

  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <XStack gap="$2">
        <GameSaves onSelect={() => navigation.goBack()} />
      </XStack>
    </View>
  );
}

export default GameSavesModal;
