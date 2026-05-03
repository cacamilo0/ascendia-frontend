import { defineStore } from 'pinia'

function normalizeQuestions(blocks) {
    const questions = []
    for (const block of blocks) {
        for (const question of block.questions) {
            questions.push({
                ...question,
                passage: block.passage ?? null,
            })
        }
    }
    return questions
}

export const useTestStore = defineStore('test', {
    state: () => ({
        sessionId: null,
        mode: null,
        area: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        feedback: {},
        tips: {},
        finishData: null,
        review: null,
        status: 'idle',
    }),

    getters: {
        totalQuestions: (state) => state.questions.length,

        currentQuestion: (state) => state.questions[state.currentIndex] ?? null,

        answeredCount: (state) => Object.keys(state.answers).length,

        omittedCount: (state) => {
            const total = state.questions.length
            const answered = Object.keys(state.answers).length
            return total - answered
        },

        isFirst: (state) => state.currentIndex === 0,

        isLast: (state) => state.currentIndex === state.questions.length - 1,

        progressPercent: (state) => {
            if (state.questions.length === 0) return 0
            return Math.round((Object.keys(state.answers).length / state.questions.length) * 100)
        },
    },

    actions: {
        setSession(sessionId, mode, area, blocks) {
            this.sessionId = sessionId
            this.mode = mode
            this.area = area
            this.questions = normalizeQuestions(blocks)
            this.currentIndex = 0
            this.answers = {}
            this.feedback = {}
            this.tips = {}
            this.finishData = null
            this.review = null
            this.status = 'in_progress'
            this._persist()
        },

        setAnswer(questionId, selectedOptionId) {
            this.answers[questionId] = selectedOptionId
            this._persist()
        },

        setFeedback(questionId, feedbackData) {
            this.feedback[questionId] = feedbackData
        },

        setTip(questionId, tip) {
            this.tips[questionId] = tip
        },

        setFinishData(data) {
            this.finishData = data
        },

        setReview(data) {
            this.review = data
            this.status = 'completed'
            localStorage.removeItem('ascendia_session')
        },

        goNext() {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++
            }
        },

        goPrev() {
            if (this.currentIndex > 0) {
                this.currentIndex--
            }
        },

        restore() {
            const saved = localStorage.getItem('ascendia_session')
            if (!saved) return false
            try {
                const { sessionId, mode, area, questions, currentIndex, answers } = JSON.parse(saved)
                this.sessionId = sessionId
                this.mode = mode
                this.area = area
                this.questions = questions
                this.currentIndex = currentIndex ?? 0
                this.answers = answers ?? {}
                this.status = 'in_progress'
                return true
            } catch {
                localStorage.removeItem('ascendia_session')
                return false
            }
        },

        reset() {
            this.sessionId = null
            this.mode = null
            this.area = null
            this.questions = []
            this.currentIndex = 0
            this.answers = {}
            this.feedback = {}
            this.tips = {}
            this.finishData = null
            this.review = null
            this.status = 'idle'
            localStorage.removeItem('ascendia_session')
        },

        _persist() {
            localStorage.setItem('ascendia_session', JSON.stringify({
                sessionId: this.sessionId,
                mode: this.mode,
                area: this.area,
                questions: this.questions,
                currentIndex: this.currentIndex,
                answers: this.answers,
            }))
        },
    },
})