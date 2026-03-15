import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isWide = width >= 1024;

  const numColumns = isWide ? 4 : isWeb ? 3 : 2;
  const contentMaxWidth = isWide ? 960 : isWeb ? 720 : undefined;

  return { width, isWeb, isWide, numColumns, contentMaxWidth };
}
