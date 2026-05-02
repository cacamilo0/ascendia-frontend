import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: null,
        email: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.userId,
    },

    actions: {
        setUser(userId, email) {
            this.userId = userId
            this.email = email
            localStorage.setItem('ascendia_user', JSON.stringify({ userId, email }))
        },

        restoreUser() {
            const saved = localStorage.getItem('ascendia_user')
            if (!saved) return
            const { userId, email } = JSON.parse(saved)
            this.userId = userId
            this.email = email
        },

        logout() {
            this.userId = null
            this.email = null
            localStorage.removeItem('ascendia_user')
            localStorage.removeItem('ascendia_session')
        },
    },
})