import client from './client.js'

export function startTest(userId) {
    return client.post(`/test/start?userId=${userId}`)
}

export function getQuestions(sessionId) {
    return client.get(`/questions?sessionId=${sessionId}`)
}

export function submitTest(sessionId, answers) {
    return client.post('/test/submit', { sessionId, answers })
}