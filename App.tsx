import * as React from 'react';
import { PressableExample } from './components/PressableExample';
import { BetterImageExample } from './components/BetterImageExample';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OverscrollExample } from './components/OverscrollExample';

const EXAMPLES = {
  PressableExample,
  BetterImageExample,
  TextBannerExample: OverscrollExample,
};

const ActiveExample = EXAMPLES.TextBannerExample;

export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ActiveExample />
    </SafeAreaProvider>
  );
};
