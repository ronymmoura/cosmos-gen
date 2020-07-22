import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.backgrounds.light};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  width: 100%;
  flex: 1;

  display: flex;
`;
