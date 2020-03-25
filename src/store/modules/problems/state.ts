import { FullProblem, PartialProblem } from '@/models'
import { ProblemError } from '@/models/problems'
import { CrudState } from '@/store/CrudModule'

export class ProblemsState extends CrudState<FullProblem | PartialProblem> {
   public errorHistory: Array<ProblemError> = []
}
