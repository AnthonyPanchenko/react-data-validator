import './custom-button.scss';

type PropsTypes = {
  isProcessing?: boolean;
  isDisabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  fontSize?: string;
  children?: React.ReactNode | React.ReactNode[] | string | null;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function CustomButton({
  type = 'button',
  isDisabled = false,
  isProcessing = false,
  className,
  children,
  fontSize = '1.6rem',
  onClick
}: PropsTypes) {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isDisabled && typeof onClick === 'function' && !isProcessing) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      className={isProcessing ? `button ${className} processing` : `button ${className}`}
      disabled={isDisabled || isProcessing}
      style={{ '--btn-font-size': fontSize } as React.CSSProperties}
      onClick={handleButtonClick}
    >
      {children}
    </button>
  );
}

/*
      #dots #dot1 {
        animation: load 1s infinite;
      }

      #dots #dot2 {
        animation: load 1s infinite;
        animation-delay: 0.2s;
      }

      #dots #dot3 {
        animation: load 1s infinite;
        animation-delay: 0.4s;
      }

      @keyframes load {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    <svg
      id="dots"
      width="132px"
      height="58px"
      viewBox="0 0 132 58"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle id="dot1" cx="25" cy="30" r="13"></circle>
      <circle id="dot2" cx="65" cy="30" r="13"></circle>
      <circle id="dot3" cx="105" cy="30" r="13"></circle>
    </svg>
*/
