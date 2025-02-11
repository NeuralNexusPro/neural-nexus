import React from 'react';
import { useLocale, IconButton } from '@chatui/core';

interface SendButtonProps {
  disabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SendButton = ({ disabled, onClick }: SendButtonProps) => {
  const { trans } = useLocale('Composer');
  return (
    <div className="Composer-actions">
      {/* <Button
        className="Composer-sendBtn"
        disabled={disabled}
        onMouseDown={onClick}
        color="primary"
      >
        {trans('send')}
      </Button> */}

      <IconButton
        className="Composer-sendBtn"
        icon="send"
        disabled={disabled}
        onMouseDown={onClick}
      >
      {trans('send')}
      </IconButton>
    </div>
  );
};