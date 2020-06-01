
export const when = (isEnded: () => boolean) => new Promise(resolve => {

    const tryEnd = () => setTimeout(() => {
      if(!isEnded()) {
        tryEnd()
        return
      }
  
      resolve()
    }, 10)  
  
    tryEnd()
  })
