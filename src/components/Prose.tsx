import clsx from 'clsx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Prose({ children, className }: any) {
  return (
    <div className={clsx(className, 'prose dark:prose-invert')}>{children}</div>
  )
}
