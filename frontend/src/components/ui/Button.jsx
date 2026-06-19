import { cx } from '../../utils/cx'

const variants = {
  primary: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:outline-slate-950',
  secondary: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-700',
  outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:outline-slate-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-slate-700',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

function Button({
  as: Component = 'button',
  children,
  className,
  disabled,
  isLoading,
  leftIcon,
  rightIcon,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <Component
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={Component === 'button' ? type : undefined}
      {...props}
    >
      {isLoading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </Component>
  )
}

export default Button
