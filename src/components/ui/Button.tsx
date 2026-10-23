import React from 'react';
import { cn } from '@/lib/utils';
import { SpecularButton, SpecularButtonProps } from './SpecularButton';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'specular' | 'plain-primary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  // Optional specular-specific overrides when variant === 'primary' | 'specular'
  specularProps?: Partial<SpecularButtonProps>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', specularProps, children, ...props }, ref) => {
    // Both 'primary' (the default) and 'specular' use SpecularButton with AICTE Enterprise theme defaults
    if (variant === 'primary' || variant === 'specular') {
      const defaultRadius = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
      return (
        <SpecularButton
          ref={ref}
          size={size}
          radius={specularProps?.radius ?? defaultRadius}
          tint={specularProps?.tint ?? '#1d4ed8'}
          tintOpacity={specularProps?.tintOpacity ?? 0.9}
          textColor={specularProps?.textColor ?? '#ffffff'}
          lineColor={specularProps?.lineColor ?? '#bfdbfe'}
          baseColor={specularProps?.baseColor ?? '#1e3a8a'}
          intensity={specularProps?.intensity ?? 1.3}
          idleIntensity={specularProps?.idleIntensity ?? 0.5}
          glow={specularProps?.glow ?? 1.2}
          thickness={specularProps?.thickness ?? 1.5}
          followMouse={specularProps?.followMouse ?? true}
          autoAnimate={specularProps?.autoAnimate ?? true}
          speed={specularProps?.speed ?? 0.4}
          className={cn('font-semibold shadow-sm', className)}
          {...props}
          {...specularProps}
        >
          {children}
        </SpecularButton>
      );
    }

    const variantStyles: Record<string, string> = {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm focus-visible:ring-blue-500',
      'plain-primary': 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm focus-visible:ring-blue-500',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 focus-visible:ring-slate-400',
      outline:
        'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
      ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-500',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs rounded-md',
      md: 'h-9 px-4 text-sm rounded-lg',
      lg: 'h-11 px-6 text-base rounded-lg',
      icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { SpecularButton };
export type { SpecularButtonProps };

