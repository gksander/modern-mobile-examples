import * as React from 'react';
import { PressableExample } from './components/PressableExample';
import { BetterImageExample } from './components/BetterImageExample';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const EXAMPLES = {
  PressableExample,
  BetterImageExample,
};

const ActiveExample = EXAMPLES.BetterImageExample;

export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ActiveExample />
    </SafeAreaProvider>
  );
};
