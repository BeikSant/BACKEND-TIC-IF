//Almacena todos los origenes que tendran acceso al API
const whitelist = [process.env.ORIGIN_1, process.env.ORIGIN_2, process.env.ORIGIN_3 ? process.env.ORIGIN_3 : '']

export default {
    origin: function (origin, callback) {
        if (process.env.MODO == 'desarrollo') return callback(null, true)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}