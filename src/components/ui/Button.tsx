import React from 'react';
import { cn } from '@/lib/utils';
import { SpecularButton, SpecularButtonProps } from './SpecularButton';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'specular';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  // Optional specular-specific overrides when variant === 'specular'
  specularProps?: Partial<SpecularButtonProps>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', specularProps, children, ...props }, ref) => {
    // If specular variant is selected, delegate to SpecularButton with AICTE Enterprise theme defaults
    if (variant === 'specular') {
      const specularSize: 'sm' | 'md' | 'lg' = size === 'icon' ? 'sm' : size;
      return (
        <SpecularButton
          ref={ref}
          size={specularSize}
          radius={specularProps?.radius ?? 10}
          tint={specularProps?.tint ?? '#1e3a8a'}
          tintOpacity={specularProps?.tintOpacity ?? 0.85}
          textColor={specularProps?.textColor ?? '#ffffff'}
          lineColor={specularProps?.lineColor ?? '#93c5fd'}
          baseColor={specularProps?.baseColor ?? '#1e293b'}
          intensity={specularProps?.intensity ?? 1.2}
          idleIntensity={specularProps?.idleIntensity ?? 0.45}
          glow={specularProps?.glow ?? 1.1}
          thickness={specularProps?.thickness ?? 1.4}
          followMouse={specularProps?.followMouse ?? true}
          autoAnimate={specularProps?.autoAnimate ?? false}
          className={cn('font-semibold shadow-md', className)}
          {...props}
          {...specularProps}
        >
          {children}
        </SpecularButton>
      );
    }

    const variantStyles = {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm focus-visible:ring-blue-500',
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

