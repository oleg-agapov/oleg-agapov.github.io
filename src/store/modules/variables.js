const socialLinks = [
    {
        name: 'LinkedIn',
        file: 'assets/social_linkedin.png',
        to: 'https://linkedin.com/in/oagapov/',
    },
    {
        name: 'facebook',
        file: 'assets/social_facebook.png',
        to: 'https://facebook.com/oleg.agapov.ua',
    },
    {
        name: 'GitHub',
        file: 'assets/social_github.png',
        to: 'https://github.com/oleg-agapov',
    },
    {
        name: 'Telegram',
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
