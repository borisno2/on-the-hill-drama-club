export default function labelHelper(
  options: { label: string; value: string }[],
  value: string
) {
  const option = options.find((option) => option.value === value)
  return option?.label
}
