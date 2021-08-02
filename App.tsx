import * as React from 'react';
import { PressableExample } from './components/PressableExample';
import { BetterImageExample } from './components/BetterImageExample';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OverscrollExample } from './components/OverscrollExample';
import { SearchBarExample } from './components/SearchBarExample';

const EXAMPLES = {
  PressableExample,
  BetterImageExample,
  TextBannerExample: OverscrollExample,
  SearchBarExample: SearchBarExample,
};

const ActiveExample = EXAMPLES.SearchBarExample;

export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ActiveExample />
    </SafeAreaProvider>
  );
};
