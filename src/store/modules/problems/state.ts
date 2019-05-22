import {FullProblem, PartialProblem, ProblemStatus, ProblemTestingStatus} from "@/models";
import {ProblemError, Tag} from "@/models/problems";

export enum ProblemFilter {
   All = "All",
   Public = "Open",
   NotPublic = "Closed",
   Resolved = "Resolved"
}


export class ProblemsState {
   data: Array<FullProblem | PartialProblem> = []
   filter: ProblemFilter = ProblemFilter.All
   filterTags: Array<Tag> = []
   tags: Array<Tag> = []
   errorHistory: Array<ProblemError> = []
}
