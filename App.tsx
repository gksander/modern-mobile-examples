import * as React from 'react';
import { PressableExample } from './components/PressableExample';

const EXAMPLES = {
  PressableExample,
};

const ActiveExample = EXAMPLES.PressableExample;

export const App: React.FC = () => {
  return <ActiveExample />;
};
