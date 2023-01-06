import axios from "axios"

export const get = async (url) => {
    let header;
    var token = localStorage.getItem('token');
    if (token) {
        header = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        }
    }
    const response = await axios.get(url, {
        headers: header
    }).then(res => {
        return res;
    }).catch(err => {
        console.error(err);
    })
    return response
}


export const post = async (url, data) => {
    const header = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
    };

    const response = await axios.post(url, data, {
        headers: header
    }).then(res => {
        return res;
    }).catch(err => {
        return {
            status: false,
            message: err.message
        }
    })
    return response;
}

export const put = async (url, data) => {
    const header = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
    };
    const response = await axios.put(url, data, {
        headers: header
    }).then(res => {
        return res;
    }).catch(err => {
        return {
            status: false,
            message: err.message
        }
    })
    return response;
}


export const remove = async (url, data) => {
    const header = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
    };
    const response = await axios.delete(url, {
        data: data,
        headers: header
    }).then(res => {
        return res;
    }).catch(err => {
        return {
            status: false,
            message: err.message
        }
    })
    return response;
}