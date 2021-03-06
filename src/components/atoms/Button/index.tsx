import './style.module.scss';

import React, { ComponentPropsWithoutRef, FC } from 'react';

export type ButtonProps = Pick<
  ComponentPropsWithoutRef<'button'>,
  'disabled' | 'type'
>;

const Button: FC<ButtonProps> = ({ children, disabled, type }) => (
  // eslint-disable-next-line react/button-has-type
  <button disabled={disabled} styleName="button" type={type}>
    {children}
  </button>
);

export default Button;
