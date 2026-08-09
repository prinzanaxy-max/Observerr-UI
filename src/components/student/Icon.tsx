import { memo } from 'react';

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

const Icon = memo(({ name, className = '', filled = false }: IconProps) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
    aria-hidden="true"
  >
    {name}
  </span>
));

Icon.displayName = 'Icon';

export default Icon;
