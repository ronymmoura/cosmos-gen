import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Login from '@pages/Login';

import { Container, Content } from './styles';
import Header from './Header';

const Window: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <BrowserRouter>
          <Route component={Login} path={'/'} exact />
        </BrowserRouter>
      </Content>
    </Container>
  );
}

export default Window;
