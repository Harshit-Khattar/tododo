import { useLayoutEffect, useRef, type RefObject } from 'react'

/** Keeps a textarea exactly as tall as its content. */
export function useAutoGrow(value: string, external?: RefObject<HTMLTextAreaElement | null>) {
  const internal = useRef<HTMLTextAreaElement>(null)
  const ref = external ?? internal

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value, ref])

  return ref
}
