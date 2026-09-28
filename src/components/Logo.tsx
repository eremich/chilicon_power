import markUrl from '../assets/brand/logo-mark.svg';
import wordmarkUrl from '../assets/brand/logo-wordmark.svg';

export interface LogoProps {
  variant?: 'mark' | 'wordmark';
  className?: string;
}

/** The Chilicon Power logo. The palette's brand orange and OK green come from it. */
export const Logo = ({ variant = 'mark', className }: LogoProps) => (
  <img src={variant === 'mark' ? markUrl : wordmarkUrl} alt="Chilicon Power" className={className} />
);
