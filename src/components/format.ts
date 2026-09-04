/** Signed number with a true minus sign, for display only. */
export function signed(value: number, digits = 2): string {
  const fixed = Math.abs(value)
    .toFixed(digits)
    .replace(/\.?0+$/, '');
  return `${value < 0 ? '−' : '+'}${fixed}`;
}

/** Unsigned number with a true minus sign when negative. */
export function plain(value: number, digits = 1): string {
  return value < 0
    ? `−${Math.abs(value).toFixed(digits)}`
    : value.toFixed(digits);
}

/** Percentage of a diverging bar, measured from the centre. */
export function divergingBar(value: number, domain: number) {
  const width = (Math.abs(value) / domain) * 50;
  return {
    width: `${width}%`,
    left: value < 0 ? `${50 - width}%` : '50%',
  };
}
