import { SymFor } from '@/lazyDB/core/utils'
import { isProducer } from '@/lazyDB/core/common'

export const TemporalTrap = SymFor('temporal trap')

export const makeTemporalTrapObject = () => {
  console.log('make temporal trap')
  return {
    [TemporalTrap]: true
  }
}

export const isTemporalTrapProducer = (value: any) => isProducer(value) && value[TemporalTrap]

export const isTemporalTrap = (value: any) =>
  value
  && typeof value === 'object'
  && value[TemporalTrap]
