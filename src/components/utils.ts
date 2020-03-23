
export function toStringWhenDefined(value: any): string {
  if (value === undefined)
    return ''

  if (value === null)
    return ''

  return `${value}`
}

export function isDate(date: any) {
  return Object.prototype.toString.call(date) === '[object Date]'
}

export function formatDate(date: Date) {
  if (!date)
    return ''

  return date.toLocaleDateString()
}

export function randomId(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
}

export interface IOnWheelCallbacks {
   up?: () => void
   down?: () => void
}

export function onWheel(elem: Element, { up = () => { }, down = () => { } }: IOnWheelCallbacks) {
  const onWheelListener: EventListener = e => {
    e = e || window.event

    // wheelDelta не дает возможность узнать количество пикселей
    // @ts-ignore
    const delta = e.deltaY || e.detail || -e.wheelDelta

    if (e.preventDefault)
      e.preventDefault()
    else
      e.returnValue = false

    if (delta < 0)
      up()
    else
      down()
  }

  if (elem.addEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      elem.addEventListener('wheel', onWheelListener)
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      elem.addEventListener('mousewheel', onWheelListener)
    } else {
      // Firefox < 17
      elem.addEventListener('MozMousePixelScroll', onWheelListener)
    }
  } else {
    // IE8-
    // @ts-ignore
    elem.attachEvent('onmousewheel', onWheelListener)
  }
}
