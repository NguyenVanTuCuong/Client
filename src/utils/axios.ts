import axios, { AxiosError, AxiosHeaders } from "axios"

export const customAxios = axios.create()

customAxios.interceptors.request.use(
    (config) => {
        const headers = new AxiosHeaders({
            ...config.headers,
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
        })
        return {
            ...config,
            headers,
        }
    },
    (ex) => {
        return Promise.reject(ex)
    }
)

customAxios.interceptors.response.use(
    async (response) => {
        const { data, authTokens } = response.data
        if (authTokens?.accessToken)
            localStorage.setItem("token", authTokens.accessToken)
        return data
    },
    async (ex: AxiosError) => {
        throw ex.response?.data
    }
)