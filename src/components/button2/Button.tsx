import React, { PropsWithChildren, ReactNode } from 'react';
import { Button, ButtonProps } from 'antd';
import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';

interface ButtonCustomProps extends PropsWithChildren, ButtonProps {
  prefixIcon?: ReactNode;
  noBorder?: boolean;
  large?: boolean;
}

const CustomButton = styled(Button)<ButtonCustomProps>`
  background-color: transparent;
  height: fit-content;
  border: none;
  padding: ${(props) => (props.large ? '16px 32px' : '8px 16px')};
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  height: auto;
  &:hover {
    background-color: #40a9ff;
  }
`;

const ContainerButton = styled('div')<ButtonCustomProps>`
  border: ${(props) => (props.noBorder ? 'none' : '2px solid green')};
  border-radius: 4px;
  width: fit-content;
`;
// change the rendered tag using withComponent
const Link = CustomButton.withComponent('a');
// Customizing prop forwarding

const ButtonCustom2 = (props: ButtonCustomProps) => {
  const { children, noBorder, ...rest } = props;

  return (
    <>
      <ContainerButton noBorder={noBorder}>
        <CustomButton {...rest}>{children}</CustomButton>
      </ContainerButton>
    </>
  );
};

export default ButtonCustom2;
