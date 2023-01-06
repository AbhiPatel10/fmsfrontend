import toast from 'react-hot-toast';

export function successToast(message){
    toast.success(message)
}

export function errorToast(message){
    toast.error(message)
}

export const ENDPOINTURL = "https://fmsbackend.onrender.com"

export const EventEmitter = {
    events: {},
    dispatch: function (event, data) {
        if (!this.events[event]) return
        this.events[event].forEach((callback) => callback(data))
    },

    subscribe: function (event, callback) {
        if (!this.events[event]) this.events[event] = []
        this.events[event].push(callback)
    }
}

