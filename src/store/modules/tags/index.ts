import TagsState from "@/store/modules/tags/state";
import mutations from "@/store/modules/tags/mutations";
import actions from "@/store/modules/tags/actions";


export default {
   namespaced: true,
   state: new TagsState(),
   mutations,
   actions
}

