import { defineStore } from 'pinia'

// Agrupa bloques STANDALONE consecutivos en uno solo
function normalizeBlocks(blocks) {
    const result = []

    for (const block of blocks) {
        if (block.type === 'STANDALONE') {
            const last = result[result.length - 1]
            if (last?.type === 'STANDALONE') {
                // Agrupa con el bloque STANDALONE anterior
                last.questions.push(...block.questions)
            } else {
                // Crea nuevo bloque STANDALONE con copia del array
                result.push({ ...block, questions: [...block.questions] })
            }
        } else {
            result.push(block)
        }
    }

    return result
}

export const useTestStore = defineStore('test', {
    state: () => ({
        sessionId: null,
        area: null,
        blocks: [],
        answers: {},
        results: null,
        status: 'idle', // idle | loading | in_progress | submitting | completed
    }),

    getters: {
        totalQuestions: (state) =>
            state.blocks.reduce((sum, block) => sum + block.questions.length, 0),

        answeredCount: (state) => Object.keys(state.answers).length,

        isComplete: (state) => {
            const total = state.blocks.reduce((sum, block) => sum + block.questions.length, 0)
            const answered = Object.keys(state.answers).length
            return answered === total && total > 0
        },

        answersPayload: (state) =>
            Object.entries(state.answers).map(([questionId, selectedOptionId]) => ({
                questionId: Number(questionId),
                selectedOptionId,
            })),
    },

    actions: {
        setSession(sessionId, area, blocks) {
            this.sessionId = sessionId
            this.area = area
            this.blocks = normalizeBlocks(blocks)
            this.answers = {}
            this.status = 'in_progress'
            this._persistSession()
        },

        answerQuestion(questionId, selectedOptionId) {
            this.answers[questionId] = selectedOptionId
            this._persistSession()
        },

        setResults(results) {
            this.results = results
            this.status = 'completed'
            localStorage.removeItem('ascendia_session')
        },

        restoreSession() {
            const saved = localStorage.getItem('ascendia_session')
            if (!saved) return false
            const { sessionId, answers } = JSON.parse(saved)
            this.sessionId = sessionId
            this.answers = answers
            return true
        },

        reset() {
            this.sessionId = null
            this.area = null
            this.blocks = []
            this.answers = {}
            this.results = null
            this.status = 'idle'
            localStorage.removeItem('ascendia_session')
        },

        _persistSession() {
            localStorage.setItem(
                'ascendia_session',
                JSON.stringify({
                    sessionId: this.sessionId,
                    answers: this.answers,
                })
            )
        },
    },
})