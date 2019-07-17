import Timer = NodeJS.Timer;

export function isHover(x: number, y: number, maxX: number, maxY: number, limit: number ) {

   const isSideXHovered = x / (maxX + 0.0) > (1 - limit);
   const isSideYHovered = y / (maxY + 0.0) < (limit);

   return isSideXHovered && isSideYHovered;
}

export interface IListener {
   destroy: () => void;
}

export function onMouseOutOfWindow(callback: () => void): IListener {
   const mousemoveListener: EventListener = (event) => {
      // @ts-ignore
      if (event.fromElement && event.fromElement.nodeName === 'HTML') {
         callback();
      }
   };

   document.addEventListener('mouseout', mousemoveListener);

   return {
      destroy() {
         document.removeEventListener('mouseout', mousemoveListener);
      },
   };
}

export function isPredictiveHover(event: MouseEvent, el: HTMLElement, limit: number = 0.25): boolean {
   return isHover(event.pageX, event.pageY - el.scrollTop, el.offsetWidth, el.offsetHeight, limit);
}

export function onPredictiveHover(start: () => boolean, end: () => boolean): IListener {
   let isHovered = false;

   const mousemoveListener: EventListener = (event) => {
      const el: HTMLElement | null = document.querySelector('html');
      if (!el) {
         console.error('Unexpected error');
         return;
      }

      if (isHovered) {
         if (!isPredictiveHover(event as MouseEvent, el)) {
            isHovered = end();
         }
      } else {
         if (isPredictiveHover(event as MouseEvent, el, 0.1)) {
            isHovered = start();
         }
      }
   };

   document.addEventListener('mousemove', mousemoveListener);

   const mouseOut = onMouseOutOfWindow(() => {
      if (isHovered) {
         isHovered = end();
      }
   });

   return {
      destroy() {
         mouseOut.destroy();
         document.removeEventListener('mousemove', mousemoveListener);
      },
   };
}

export function onScroll(start: (top: number) => void, end: (top: number) => void) {
   let oldScroll = 0;

   window.onscroll = () => {
      const el: HTMLElement | null = document.querySelector('html');
      if (!el) {
         console.error('Unexpected error');
         return;
      }

      if (oldScroll - el.scrollTop > 0) {
         start(el.scrollTop);
      } else {
         end(el.scrollTop);
      }

      oldScroll = el.scrollTop;
   };
}

function getCoords(elem: Element) {
   const box = elem.getBoundingClientRect();
   return {
      top: box.top + window.pageYOffset || document.documentElement.scrollTop,
      left: box.left + window.pageXOffset || document.documentElement.scrollLeft,
      right: box.right,
      bottom: box.bottom,
      height: box.height,
      width: box.width,
   };
}

export interface ISideHoverCallbacks {
   left?: (probability: number, event: MouseEvent) => void;
   right?: (probability: number, event: MouseEvent) => void;
   center?: (probability: number, event: MouseEvent) => void;
}

export function onSideHover(elem: Element, limit: number = 0.2, {left = () => {}, right = () => {}, center = () => {}}: ISideHoverCallbacks) {
   const html = document.querySelector('html');
   if (!html) {
      return console.error('Unexpected error');
   }

   const listener = (event: MouseEvent) => {
      const box = getCoords(elem);

      const probability = (event.pageX - box.left) / box.width;

      if (probability < limit) {
         return left(probability, event);
      }

      if (probability > 1 - limit) {
         return right(probability, event);
      }

      center(probability, event);
   };

   elem.addEventListener('mousemove', listener as EventListener);
}

