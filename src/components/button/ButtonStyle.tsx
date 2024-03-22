import { css } from '@emotion/react';

export const buttonStyle = {
  containerButton: css({
    border: '1px solid gray',
    borderRadius: '4px',
    width: 'fit-content',
    backgroundColor: 'yellow',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
  }),
  button: css({
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
    height: 'fit-content',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  })
};
