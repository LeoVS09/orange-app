import {SymFor} from "@/lazyDB/core/utils";
import {isProducer} from "@/lazyDB/core/common";

export const TemporalTrap = SymFor('temporal trap')

export const makeTemporalTrapObject = () => ({
   [TemporalTrap]: true
})

export const isTemporalTrap = (value: any) =>
   isProducer(value) && value[TemporalTrap]
