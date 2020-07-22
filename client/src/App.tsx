import React from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Window from '@components/Window';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/theme';
import AppProvider from './context';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppProvider>
        <Window />
      </AppProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
}

render(<App />, mainElement);
