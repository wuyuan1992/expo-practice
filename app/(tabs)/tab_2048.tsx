import { XStack, YStack } from 'tamagui';
import GameManager from 'components/biz/2048/GameManager';

export default function TabOneScreen() {
  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <XStack ai="center" jc="center" fw="wrap" gap="$1.5" pos="absolute" b="$8">
        <GameManager />
      </XStack>
    </YStack>
  );
}
