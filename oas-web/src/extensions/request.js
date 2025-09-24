import axios from "axios";
import qs from "qs";
import {SERVER_CONFIG} from "@/config.js";
import {useUserStore} from "@/extensions/userStore.js";

const userStore = useUserStore()

class Request {
    constructor() {
        this.instance = axios.create({
            baseURL: SERVER_CONFIG.url,
            timeout: 6000,
            paramsSerializer: (params) => {
                return qs.stringify(params, {arrayFormat: "repeat"})
            }
        })

        this.instance.interceptors.request.use(config => {
            config.headers.Authorization = userStore.token
            return config
        })

        this.instance.interceptors.response.use(response => {
            if (response.data instanceof Blob) {
                return Promise.resolve({
                    code: 1,
                    message: "",
                    data: response.data
                })
            } else {
                const {code, message, data} = response.data
                return Promise.resolve({
                    code: code,
                    message: message,
                    data: data
                })
            }
        }, error => {
            try {
                const {code, message} = error.response.data
                return Promise.resolve({
                    code: code,
                    message: message,
                    data: null
                })
            } catch (e) {
                return Promise.resolve({
                    code: 0,
                    message: "发生未知错误！",
                    data: null
                })
            }
        })
    }

    processUrl(url, path) {
        return path === "" ? url : `${url}/${path}`
    }

    async get(url, {params = {}, path = ""} = {}) {
        return await this.instance.get(this.processUrl(url, path), {params: params})
    }

    async post(url, data) {
        return await this.instance.post(url, data)
    }

    async put(url, data, path) {
        return await this.instance.put(this.processUrl(url, path), data)
    }

    async delete(url, {params = {}, path = ""} = {}) {
        return await this.instance.delete(this.processUrl(url, path), {params: params})
    }

    async upload(url, file, fileName) {
        const form = new FormData()
        form.append(fileName, file)
        return await this.instance.post(url, form, {headers: {"Content-Type": "multipart/form-data"}})
    }

    async download(url, params) {
        return await this.instance.get(url, {params: params, responseType: "blob"})
    }
}

const request = new Request()

export {request}