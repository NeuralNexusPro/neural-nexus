import React from 'react';
import { ClickOutside } from '@chatui/core';

interface AccessoryWrapProps {
  onClickOutside: () => void;
  children: React.ReactNode;
}

export const AccessoryWrap = ({ onClickOutside, children }: AccessoryWrapProps) => (
  <ClickOutside onClick={onClickOutside}>{children}</ClickOutside>
);