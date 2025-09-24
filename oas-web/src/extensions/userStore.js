import {computed, ref} from 'vue'
import {defineStore} from 'pinia'


const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
}

const getTokenFromStorage = () => {
    return localStorage.getItem('token')
}

export const useUserStore = defineStore('user', () => {
    const _user = ref(getUserFromStorage())
    const _token = ref(getTokenFromStorage())

    function setUser(newUser) {
        _user.value = newUser
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    function setToken(newToken) {
        _token.value = newToken
        localStorage.setItem('token', newToken)
    }

    const user = computed(() => _user.value)

    const token = computed(() => _token.value)

    function clear() {
        _user.value = null
        _token.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return {user: user.value, token: token.value, setUser, setToken, clear}
})