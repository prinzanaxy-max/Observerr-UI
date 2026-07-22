type ObserverrLogoProps = {
  className?: string;
  /** Use on dark backgrounds so the logo reads as light */
  variant?: 'default' | 'light';
};

const ObserverrLogo = ({ className = 'h-8 w-8', variant = 'default' }: ObserverrLogoProps) => (
  <img
    src="/observerr-logo.png"
    alt="Observerr"
    className={`object-contain ${variant === 'light' ? 'brightness-0 invert' : ''} ${className}`}
  />
);

export default ObserverrLogo;
