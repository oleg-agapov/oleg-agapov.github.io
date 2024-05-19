const socialLinks = [
    {
        name: 'LinkedIn',
        username: '@oleg-agapov',
        file: 'assets/social_linkedin.png',
        to: 'https://linkedin.com/in/oleg-agapov/',
    },
    {
        name: 'GitHub',
        username: '@oleg-agapov',
        file: 'assets/social_github.png',
        to: 'https://github.com/oleg-agapov',
    },
    {
        name: 'Telegram',
        username: '@oleg_agapov',
        file: 'assets/social_telegram.png',
        to: 'https://t.me/oleg_agapov',
    },
]

export default {
    state: () => ({
        socialLinks,
    }),
    getters: {},
    mutations: {
        SET_NAME(state, payload) {
            state.name = payload
        },
    },
    actions: {
        saveName({ commit }, data) {
            commit('SET_NAME', data)
        },
    },
}
