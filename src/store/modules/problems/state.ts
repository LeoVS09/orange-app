import {FullProblem, PartialProblem} from "@/models";
import {ProblemError} from "@/models/problems";
import {CrudState} from "@/store/CrudModule";

export enum ProblemFilter {
   All = "All",
   Public = "Open",
   NotPublic = "Closed",
   Resolved = "Resolved"
}


export class ProblemsState extends CrudState<FullProblem | PartialProblem> {
   filter: ProblemFilter = ProblemFilter.All
   errorHistory: Array<ProblemError> = []
}
