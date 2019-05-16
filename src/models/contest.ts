import {FullProblem, ResultOfProblem} from "./problem";

export interface Requirements {
  course?: number
}

export interface Contest {
  id: string,
  problems: Array<FullProblem>,
  isOpen: boolean,
  requirements?: {
    contestant?: Requirements,
    team?: Requirements
  },
  startDate: number,
  endDate: number,
  place?: string,
  rules?: Array<string>,
  comments?: Array<string>,
  technicalEquipment: string,
  organizers: Array<string>,
  contacts: string,
  tax: number,
  fund: number,
  results: Array<ResultOfProblem>
}
