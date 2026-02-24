import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export const CONTENT_MAX_WIDTH = 1080;
export const CONTENT_MAX_NARROW = 760;

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isWeb = Platform.OS === 'web';
    const isTablet = width >= 768;
    const isDesktop = width >= 1200;
    const horizontalPadding = width >= 1024 ? 28 : width >= 768 ? 24 : 16;
    const cardGap = width >= 768 ? 16 : 12;
    const listColumns = width >= 1200 ? 3 : width >= 768 ? 2 : 1;

    return {
      width,
      isWeb,
      isTablet,
      isDesktop,
      horizontalPadding,
      cardGap,
      listColumns,
      maxWidthStyle: {
        width: '100%' as const,
        maxWidth: CONTENT_MAX_WIDTH,
        alignSelf: 'center' as const,
      },
      narrowWidthStyle: {
        width: '100%' as const,
        maxWidth: CONTENT_MAX_NARROW,
        alignSelf: 'center' as const,
      },
    };
  }, [width]);
}
