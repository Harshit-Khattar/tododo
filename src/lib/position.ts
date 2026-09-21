const STEP = 1024

/**
 * Position for an item dropped at `index` of `siblings` (the target column,
 * excluding the moved task). Midpoint between neighbours keeps moves to a
 * single-row write.
 */
export function positionAt(siblings: { position: number }[], index: number): number {
  const before = siblings[index - 1]?.position
  const after = siblings[index]?.position

  if (before === undefined && after === undefined) return 0
  if (before === undefined) return after! - STEP
  if (after === undefined) return before + STEP
  return (before + after) / 2
}
