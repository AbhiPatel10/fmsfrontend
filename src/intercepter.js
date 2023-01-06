import axios from "axios";

axios.interceptors.request.use((req) => {
    return req;
}, (error) => {
});



axios.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    if (err.response !== undefined) {
        if (err.response.status == 400) {
            return err.response
        }
        if (err.response.data.Status === '401' || err.response.status === 401) {
            localStorage.clear();
            window.location.replace('/');
        }

        if (err.response.data.error.message === "jwt expired") {
            localStorage.clear();
            window.location.replace('/');
        }

        if (err.response.data.Status === '500' || err.response.status === 500) {
        }
    }
})