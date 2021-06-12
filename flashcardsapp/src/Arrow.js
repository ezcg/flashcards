/** @jsx jsx */

import { css, jsx } from '@emotion/core'

const Arrow = ({ direction, handleClick, disableBtn }) => (
  <button
    disabled={disableBtn}
    onClick={handleClick}
    css={css`
      display: flex;
      float:left;
      margin-top:5px;
      bottom: 20px;
      ${direction === 'right' ? `right: 5px` : `left: 5px`};
      height: 50px;
      width: 50px;
      justify-content: center;
      background: white;
      border-radius: 50%;
      border:2px solid black;
      cursor: pointer;
      align-items: center;
      transition: transform ease-in 0.1s;

      &:hover {
        transform: scale(1.1);
      }

      img {
        transform: translateX(${direction === 'left' ? '-2' : '2'}px);

        &:focus {
          outline: 0;
        }
      }
    `}
  >
    {direction === 'right'
      ? <div className="arrow" dangerouslySetInnerHTML={{ __html: "&raquo;" }} />
      : <div className="arrow" dangerouslySetInnerHTML={{ __html: "&laquo;" }} />
    }
  </button>
)

export default Arrow
