import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { View, Text, Button } from 'tamagui';
import { PanGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import useGameSaveStore from 'services/GameSaveManager';
import { layoutStyles as styles, getTileStyle } from './styles';
import { useDebounce } from 'utils/debounce';
import useGameManagerStore from 'services/GameManager';

const SWIPE_THRESHOLD = 50;

const GameManger: React.FC = () => {
  const { createSave } = useGameSaveStore.getState();
  const { grid, gameManager } = useGameManagerStore();

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const moved = gameManager.move(direction);
    if (moved && gameManager.isGameOver()) {
      Alert.alert('Game Over!', 'Wanna restart?', [
        {
          text: 'Restart',
          onPress: () => gameManager.resetGame(),
          style: 'default',
        },
      ]);
    }
  }, []);

  const handleGesture = useDebounce((event: PanGestureHandlerGestureEvent) => {
    const { translationX, translationY } = event.nativeEvent;

    // 当滑动距离不满足阈值时，不触发任何方向
    if (Math.abs(translationX) < SWIPE_THRESHOLD && Math.abs(translationY) < SWIPE_THRESHOLD) {
      return;
    }

    // 根据移动 delta 的较大方向判断
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        handleMove('right');
      } else {
        handleMove('left');
      }
    } else {
      if (translationY > 0) {
        handleMove('down');
      } else {
        handleMove('up');
      }
    }
  }, 80);

  const handleResetGame = useDebounce(() => {
    gameManager.resetGame();
  }, 200);

  const handleUndo = useDebounce(() => {
    gameManager.undo();
  }, 200);

  const handleCreateSave = useDebounce(async () => {
    await createSave(grid);
  }, 200);

  return (
    <GestureHandlerRootView>
      <View>
        <Button onPress={handleResetGame} color="#4CAF50">
          New Game
        </Button>
      </View>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View style={styles.gamePad}>
            <View style={styles.grid}>
              {grid.map((row, i) => (
                <View key={i} style={styles.row}>
                  {row.map((value, j) => {
                    const { backgroundColor, color } = getTileStyle(value);
                    return (
                      <View key={j} style={{ ...styles.cell }} backgroundColor={backgroundColor}>
                        <Text style={styles.cellText} color={color}>
                          {value || ''}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </PanGestureHandler>

        <View style={styles.actions}>
          <Button onPress={handleUndo} color="#4CAF50">
            Undo
          </Button>
          <Button onPress={handleCreateSave} color="#4CAF50">
            Create Save
          </Button>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default GameManger;
