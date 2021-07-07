import { createStore } from 'vuex'
import user from '/src/store/modules/user'
import variables from '/src/store/modules/variables'

const store = createStore({
    modules: { user, variables },
})

export default store
