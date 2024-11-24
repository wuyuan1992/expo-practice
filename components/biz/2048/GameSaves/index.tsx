import React, { useCallback, useEffect } from 'react';
import useGameSaveStore from 'services/GameSaveManager';
import { FlatList } from 'react-native';
import { Button, Text, View } from 'tamagui';
import useGameManagerStore from 'services/GameManager';

const GameSavesList: React.FC<{ onSelect: () => void }> = ({ onSelect }) => {
  const { saves, loadSaves, deleteSave } = useGameSaveStore();
  const { overrideGame } = useGameManagerStore.getState();

  useEffect(() => {
    loadSaves();
  }, []);

  if (saves.length === 0) return null;

  return (
    <View>
      <Text>存档列表</Text>
      <FlatList
        data={saves}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.createdAt.toISOString()}</Text>

            <Button onPress={() => deleteSave(item.id as number)} color="#4CAF50">
              Delete
            </Button>

            <Button
              onPress={() => {
                overrideGame(item.data);
                onSelect();
              }}
              color="#4CAF50"
            >
              Use
            </Button>
          </View>
        )}
      />
    </View>
  );
};

export default GameSavesList;
