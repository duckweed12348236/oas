import {
    SERVER_CONFIG
} from "/config.js"

class Request {
    send(url, method = 'GET', data = {}) {
        return new Promise(async (resolve, reject) => {
            let token = ""
            if (!url.startsWith("/user/login")) {
                await uni.getStorage({
                    key: 'token',
                    success: (response) => {
                        token = response.data
                    }
                })
            }
            uni.request({
                url: SERVER_CONFIG.url + url,
                method,
                data,
                header: {
                    'Authorization': token
                },
                timeout: 10000,
                success: (response) => {
                    resolve(response.data)
                },
                fail: (error) => {
                    console.log(error)
                    reject(error)
                }
            })
        })
    }

    processUrl(url, path) {
        return `${url}/${path}`
    }

    async get(url, {
        params = {},
        path = ""
    } = {}) {
        url = this.processUrl(url, path)
        return await this.send(url, "GET", params)
    }

    async post(url, data) {
        return await this.send(url, "POST", data)
    }
}

const request = new Request()

export {
    request
}