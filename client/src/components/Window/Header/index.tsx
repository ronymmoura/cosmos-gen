import React, { useCallback } from 'react';
import { remote } from 'electron';
import { FaTimes, FaWindowMinimize } from 'react-icons/fa';

import { Container, WindowActions, DefaultActionButton } from './styles';

const Header: React.FC = () => {
  const handleCloseWindow = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.close();
  }, []);

  const handleMinimizeWindow = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.minimize();
  }, []);

  return (
    <Container>
      <WindowActions>
        <DefaultActionButton color="minimize" onClick={handleMinimizeWindow}>
          <FaWindowMinimize />
        </DefaultActionButton>

        <DefaultActionButton color="close" onClick={handleCloseWindow}>
          <FaTimes />
        </DefaultActionButton>
      </WindowActions>
    </Container>
  );
}

export default Header;
