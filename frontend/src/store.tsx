import { init, RematchRootState } from '@rematch/core'
import { models } from './models/rootModel'
import { createLogger } from 'redux-logger'
import immer from '@rematch/immer'

console.log(`
                                               _               _               _                         
      S t a r t i n g           _             (_)   _         | |             | |       _                
    ____  _____  ____    ___  _| |_  _____     _  _| |_     __| | _____   ___ | |  _  _| |_  ___   ____  
   / ___)| ___ ||    \\  / _ \\(_   _)| ___ |   | |(_   _)   / _  || ___ | /___)| |_/ )(_   _)/ _ \\ |  _ \\ 
  | |    | ____|| | | || |_| | | |_ | ____| _ | |  | |_   ( (_| || ____||___ ||  _ (   | |_| |_| || |_| |
  |_|    |_____)|_|_|_| \\___/   \\__)|_____)(_)|_|   \\__)   \\____||_____)(___/ |_| \\_)   \\__)\\___/ |  __/ 
                                                                                                  |_|    
  set window.LOG_STATE = true to enable redux state logging

  `)

const logger = createLogger({
  predicate: () => !!(window as any).LOG_STATE,
})

let immerInstance: any = immer
let middlewares = [logger]

export const store = init({ models, plugins: [immerInstance()], redux: { middlewares } })

// Export types
export type Store = typeof store
export type Dispatch = typeof store.dispatch
export type ApplicationState = RematchRootState
