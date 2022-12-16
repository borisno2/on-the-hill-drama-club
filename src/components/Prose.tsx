import clsx from 'clsx'

export function Prose({ children, className }: any) {
  return (
    <div className={clsx(className, 'prose dark:prose-invert')}>{children}</div>
  )
}
