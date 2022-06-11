const Arrow = ({ direction, handleClick, disableBtn }) => (
  <button
    disabled={disableBtn}
    onClick={handleClick}
    className="button"
  >
    {direction === 'right'
      ? <div className="arrow" dangerouslySetInnerHTML={{ __html: "&raquo;" }} />
      : <div className="arrow" dangerouslySetInnerHTML={{ __html: "&laquo;" }} />
    }
  </button>
)

export default Arrow
