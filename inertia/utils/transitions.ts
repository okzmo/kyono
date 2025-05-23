import { cubicOut } from 'svelte/easing'
import { TransitionConfig } from 'svelte/transition'

export function flyBlur(
  node: Element,
  { delay = 0, duration = 75, easing = cubicOut, y = 0, x = 0, opacity = 0, blurAmount = 8 }
): TransitionConfig {
  const style = getComputedStyle(node)
  const targetOpacity = +style.opacity
  const transform = style.transform === 'none' ? '' : style.transform
  const od = targetOpacity * (1 - opacity)
  const [xValue, xUnit] = split_css_unit(x)
  const [yValue, yUnit] = split_css_unit(y)

  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
        transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
        opacity: ${targetOpacity - od * u};
        filter: blur(${blurAmount * u}px);
      `,
  }
}

function split_css_unit(value: number | string): [number, string] {
  const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/)
  return split ? [Number.parseFloat(split[1]), split[2] || 'px'] : [value as number, 'px']
}
