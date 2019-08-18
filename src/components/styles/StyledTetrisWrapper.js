import styled from 'styled-components';
import backgroundImage from '../../assets/img/bg.png';

const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${backgroundImage}) #000;
  background-size: cover;
  overflow: hidden;
`;

export default StyledTetrisWrapper;
