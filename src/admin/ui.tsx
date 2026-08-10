import { useEffect, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ----------------------------------------------------------------------------
 * Button
 * -------------------------------------------------------------------------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'outline', size = 'md', className, ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-salsa)]';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  const variants = {
    primary: 'bg-[var(--color-salsa)] text-white hover:bg-[var(--color-salsa-600)]',
    secondary: 'bg-black text-white hover:bg-neutral-800',
    outline: 'border border-neutral-300 bg-white text-black hover:bg-neutral-50',
    ghost: 'text-neutral-700 hover:bg-neutral-100',
    danger: 'border border-[var(--color-salsa)] text-[var(--color-salsa)] hover:bg-[var(--color-salsa)] hover:text-white',
  };
  return <button className={cn(base, sizes[size], variants[variant], className)} {...rest} />;
}

/* ----------------------------------------------------------------------------
 * Card
 * -------------------------------------------------------------------------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-xl border border-neutral-200 bg-white', className)}>{children}</div>;
}

/* ----------------------------------------------------------------------------
 * Badge (Status)
 * -------------------------------------------------------------------------- */
export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'green' | 'salsa' | 'amber'; children: ReactNode }) {
  const tones = {
    neutral: 'bg-neutral-100 text-neutral-600',
    green: 'bg-green-100 text-green-800',
    salsa: 'bg-[var(--color-salsa)]/10 text-[var(--color-salsa)]',
    amber: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Formular-Felder
 * -------------------------------------------------------------------------- */
export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="text-[var(--color-salsa)]"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

const fieldClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-salsa)] focus:outline-none';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClass, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldClass, 'pr-8', props.className)} />;
}

/* ----------------------------------------------------------------------------
 * Modal
 * -------------------------------------------------------------------------- */
export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      onMouseDown={onClose}
    >
      <div
        className={cn('w-full rounded-2xl bg-white shadow-xl', wide ? 'max-w-3xl' : 'max-w-lg')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Schliessen"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-neutral-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Hinweis-Banner
 * -------------------------------------------------------------------------- */
export function Banner({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'salsa' }) {
  const tones = {
    info: 'bg-neutral-50 border-neutral-200 text-neutral-700',
    salsa: 'bg-[var(--color-salsa)]/5 border-[var(--color-salsa)]/30 text-neutral-800',
  };
  return <div className={cn('rounded-lg border px-4 py-3 text-sm', tones[tone])}>{children}</div>;
}

/* ----------------------------------------------------------------------------
 * Inline-Spinner / Lade-/Fehlerzustand
 * -------------------------------------------------------------------------- */
export function Loading({ label = 'Lädt...' }: { label?: string }) {
  return <p className="py-10 text-center text-sm text-neutral-500">{label}</p>;
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-[var(--color-salsa)]">{children}</p>;
}
