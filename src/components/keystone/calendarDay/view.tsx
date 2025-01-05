import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import FocusLock from 'react-focus-lock'
import { PopoverDialog, useControlledPopover } from '@keystone-ui/popover'

import { jsx, Inline, Stack, Text } from '@keystone-ui/core'

import {
  FieldContainer,
  FieldLabel,
  DatePicker,
  FieldDescription,
} from '@keystone-ui/fields'
import { formatISO, parse } from 'date-fns'

import { DayPicker } from 'react-day-picker'
import { FieldProps } from '@keystone-6/core/types'

const formatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const deserializeDate = (date: string): Date => {
  return parse(date, 'yyyy-MM-dd', new Date())
}

const formatDateType = (date: Date): string => {
  return formatISO(date, { representation: 'date' })
}

const formatDate = (date: Date): string => formatter.format(date)

const dateFormatPlaceholder = formatter
  .formatToParts(new Date())
  .map((x) => {
    if (x.type === 'day') {
      return 'dd'
    }
    if (x.type === 'month') {
      return 'mm'
    }
    if (x.type === 'year') {
      return 'yyyy'
    }
    return x.value
  })
  .join('')

type DateInputValue = string | undefined

type DatePickerProps = {
  onUpdate: (value: string) => void
  onClear: () => void
  onBlur?: () => void
  value: string
}

function useEventCallback<Func extends (...args: any) => any>(
  callback: Func,
): Func {
  const callbackRef = useRef(callback)
  const cb = useCallback((...args: any[]) => {
    return callbackRef.current(...args)
  }, [])
  useEffect(() => {
    callbackRef.current = callback
  })
  return cb as any
}

const DatePicker = ({
  value,
  onUpdate,
  onClear,
  onBlur: _onBlur,
  ...props
}: DatePickerProps) => {
  const [isOpen, _setOpen] = useState(false)
  const onBlur = useEventCallback(() => {
    _onBlur?.()
  })
  const setOpen = useCallback(
    (val: boolean) => {
      _setOpen(val)
      if (!val) {
        onBlur?.()
      }
    },
    [onBlur],
  )
  const { dialog, trigger, arrow } = useControlledPopover(
    {
      isOpen,
      onClose: useCallback(() => {
        setOpen(false)
      }, [setOpen]),
    },
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  )

  const handleDayClick = useCallback(
    (day: Date) => {
      onUpdate(formatDateType(day))
      // wait a moment so the user has time to see the day become selected
      setTimeout(() => {
        setOpen(false)
      }, 300)
    },
    [onUpdate, setOpen],
  )

  // We **can** memoize this, but its a trivial operation
  // and in the opinion of the author not really something to do
  // before other more important performance optimisations
  const selectedDay = deserializeDate(value)
  const formattedDate: DateInputValue = value
    ? formatDate(selectedDay)
    : undefined

  return (
    <Fragment>
      <button
        aria-label={
          'Choose date' +
          (formattedDate ? `, selected date is ${formattedDate}` : '')
        }
        onClick={() => setOpen(true)}
        onClear={
          value
            ? () => {
                onClear()
                onBlur?.()
              }
            : undefined
        }
        isSelected={isOpen}
        ref={trigger.ref}
        {...props}
        {...trigger.props}
        // todo - magic number - align instead to parent Field ?
        style={{ minWidth: 200 }}
      >
        {formattedDate || dateFormatPlaceholder}
      </button>
      {isOpen && (
        <PopoverDialog
          arrow={arrow}
          isVisible
          ref={dialog.ref}
          {...dialog.props}
        >
          <FocusLock autoFocus returnFocus disabled={!isOpen}>
            <DayPicker
              onDayClick={handleDayClick}
              selected={selectedDay}
              weekStartsOn={1}
            />
          </FocusLock>
        </PopoverDialog>
      )}
    </Fragment>
  )
}

export const Field = ({
  field,
  value,
  onChange,
  forceValidation,
}: FieldProps<any>) => {
  const [touchedInput, setTouchedInput] = useState(false)
  const showValidation = touchedInput || forceValidation

  const validationMessage = showValidation
    ? validate(value, field.fieldMeta, field.label)
    : undefined

  return (
    <FieldContainer>
      <Stack>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>
        {onChange ? (
          <Inline gap="small">
            <Stack>
              <DatePicker
                onUpdate={(date) => {
                  onChange({
                    ...value,
                    value: date,
                  })
                }}
                onClear={() => {
                  onChange({ ...value, value: null })
                }}
                onBlur={() => setTouchedInput(true)}
                value={value.value ?? ''}
              />
              {validationMessage && (
                <Text color="red600" size="small">
                  {validationMessage}
                </Text>
              )}
            </Stack>
          </Inline>
        ) : (
          value.value !== null && <Text>{formatOutput(value.value)}</Text>
        )}
      </Stack>
    </FieldContainer>
  )
}

function validate(
  value: any,
  fieldMeta: any,
  label: string,
): string | undefined {
  // if we recieve null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (
    value.kind === 'update' &&
    value.initial === null &&
    value.value === null
  ) {
    return undefined
  }

  if (fieldMeta.isRequired && value.value === null) {
    return `${label} is required`
  }
  return undefined
}
