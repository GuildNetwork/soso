export function createUrl(path, baseUrl = '', params) {
    const url = new URL(path, baseUrl);
    if (params) {
        let q = '?';
        let first = true;
        for (const name in params) {
            q = `${q}${first ? '' : '&'}${name}=${encodeURIComponent(params[name])}`;
            first = false;
        }
        url.search = q;
    }
    return url.toString();
}
export async function get(url, includeCredentials = true) {
    const init = { credentials: includeCredentials ? 'include' : 'same-origin' };
    const response = await fetch(url, init);
    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message, response };
    }
    return (await response.json());
}
export async function post(url, data, includeCredentials = true) {
    const init = { method: 'POST', credentials: includeCredentials ? 'include' : 'same-origin', body: JSON.stringify(data) };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    init.headers = headers;
    const request = new Request(url, init);
    const response = await fetch(request);
    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message, response };
    }
    return (await response.json());
}
export async function del(url, includeCredentials = true) {
    const init = { method: 'DELETE', credentials: includeCredentials ? 'include' : 'same-origin' };
    const request = new Request(url, init);
    const response = await fetch(request);
    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message, response };
    }
    return response;
}
export function beacon(url, data) {
    const payload = (data && (typeof data !== 'string')) ? JSON.stringify(data) : (data || '');
    if (window.navigator.sendBeacon) {
        return window.navigator.sendBeacon(url, payload);
    }
    return false;
}
export async function postFile(url, formData) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', url);
        request.onload = () => {
            const status = request.status;
            if (status === 0 || status >= 400) {
                if (request.responseText) {
                    reject({ status, message: request.responseText });
                    ;
                }
                else {
                    reject({ status, message: 'Upload request failed with code: ' + status });
                }
            }
            else {
                if (request.responseText) {
                    resolve(JSON.parse(request.responseText));
                }
                else {
                    resolve({});
                }
            }
        };
        request.onerror = (err) => {
            reject({ status: 0, message: `There was a network error on file upload: ${err}` });
        };
        request.send(formData);
    });
}
