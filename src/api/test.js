import client from './client.js'

export function startSession(userId, mode) {
    return client.post('/sessions/start', { userId, mode })
}

export function getQuestions(sessionId) {
    return client.get(`/questions?sessionId=${sessionId}`)
}

export function postAnswer(sessionId, questionId, selectedOptionId) {
    return client.post('/answers', { sessionId, questionId, selectedOptionId })
}

export function getTip(sessionId, questionId) {
    return client.get(`/sessions/${sessionId}/questions/${questionId}/tip`)
}

export function finishSession(sessionId) {
    return client.post('/sessions/finish', { sessionId })
}

export function getReview(sessionId) {
    return client.get(`/sessions/${sessionId}/review`)
}

export function getHistory(userId) {
    return client.get(`/sessions/history?userId=${userId}`)
}