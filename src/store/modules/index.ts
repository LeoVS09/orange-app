import ui, {UIState, Platform} from './ui'
import profile, {ProfileState} from './profile'
import problems, {ProblemsState, ProblemFilter} from './problems'
import statuses, {StatusState, StatusScopes, StatusScope, ModelStatus, ISetStatusPayload} from './statuses'
import countries from './countries'
import cities from './cities'
import tags from './tags'
import universities from './universities'
import contests from './contests'

export default {
   ui,
   profile,
   problems,
   statuses,
   countries,
   cities,
   tags,
   universities,
   contests,
}

export {
   UIState,
   ProblemsState,
   ProfileState,
   Platform,
   ProblemFilter,
   StatusState,
   StatusScopes,
   StatusScope,
   ModelStatus,
   ISetStatusPayload,
}
