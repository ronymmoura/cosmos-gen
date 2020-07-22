import styled from 'styled-components';
import { shade } from 'polished';
import { defaultTheme } from '@styles/theme';

export const Container = styled.header`
  width: 100%;
  height: 40px;
  position: absolute;

  -webkit-user-select: none;
  -webkit-app-region: drag;

  display: flex;
  align-items: center;
  justify-content: center;

`;

export const WindowActions = styled.div`
  position: absolute;
  top: 1px;
  right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
`;

const colors = {
  close: defaultTheme.colors.red,
  minimize: defaultTheme.colors.white
}

interface ActionButtonProps {
  color: 'close' | 'minimize';
}

export const DefaultActionButton = styled.button<ActionButtonProps>`
  padding: 13px;
  -webkit-app-region: no-drag;
  border: 0;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;

  background: ${props => colors[props.color]};
  color: ${props =>
    props.color === 'minimize'
      ? defaultTheme.colors.grey
      : defaultTheme.colors.white
  };

  &:active {
    opacity: 0.6;
  }
  
  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }
`;
