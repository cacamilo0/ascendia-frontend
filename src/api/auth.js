import client from './client.js'

export function login(email, password) {
    return client.post('/auth/login', { email, password })
}