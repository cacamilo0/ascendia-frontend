import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor de respuesta — manejo global de errores
client.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status
        const message = error.response?.data?.message || error.message || 'Error desconocido'

        // Cuando JWT esté implementado, aquí va el manejo de 401
        // if (status === 401) { ... }

        return Promise.reject({ status, message })
    }
)

export default client