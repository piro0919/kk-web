import './style.module.scss';

import React, { ComponentPropsWithoutRef, FC } from 'react';

export type TopProps = {
  heading: ComponentPropsWithoutRef<'div'>['children'];
};

const Top: FC<TopProps> = ({ heading }) => (
  <div styleName="top">
    <div styleName="heading1-wrapper">{heading}</div>
  </div>
);

export default Top;
