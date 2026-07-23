type ObserverrLogoProps = {
  className?: string;
};

const ObserverrLogo = ({ className = 'h-8 w-8' }: ObserverrLogoProps) => (
  <img
    src="/observerr-logo.png"
    alt="Observerr"
    className={`object-contain ${className}`}
  />
);

export default ObserverrLogo;
