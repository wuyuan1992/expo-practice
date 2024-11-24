import { ColorValue, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const layoutStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
  },
  gamePad: {
    flex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flex: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  grid: {
    backgroundColor: '#BBADA0',
    padding: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 60,
    height: 60,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cellFilled: {
    color: '#FFFFFF',
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#8F7A66',
    padding: 10,
    margin: 5,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export const getTileStyle = (value: number) => {
  const styles: Record<number, { backgroundColor: ColorValue; color: ColorValue }> = {
    2: { backgroundColor: '#E0F2FE', color: '#0C4A6E' }, // 浅蓝背景，深蓝字体
    4: { backgroundColor: '#BAE6FD', color: '#1E40AF' }, // 天蓝背景，深蓝字体
    8: { backgroundColor: '#A5F3FC', color: '#155E75' }, // 浅青背景，深青字体
    16: { backgroundColor: '#99F6E4', color: '#064E3B' }, // 薄荷绿背景，深绿字体
    32: { backgroundColor: '#6EE7B7', color: '#065F46' }, // 绿色背景，深绿字体
    64: { backgroundColor: '#34D399', color: '#064E3B' }, // 亮绿背景，深绿字体
    128: { backgroundColor: '#FDE68A', color: '#92400E' }, // 柠檬黄背景，深橙字体
    256: { backgroundColor: '#FCD34D', color: '#78350F' }, // 金黄背景，深棕字体
    512: { backgroundColor: '#FBBF24', color: '#6B21A8' }, // 芒果橙背景，深紫字体
    1024: { backgroundColor: '#FB923C', color: '#4C1D95' }, // 橙色背景，深紫字体
    2048: { backgroundColor: '#F97316', color: '#9D174D' }, // 深橙背景，玫红字体
  };

  const defaultStyle = { backgroundColor: '#CDC1B4', color: '#F9F6F2' };

  return styles[value] || defaultStyle;
};
