import multer from "multer";
import periodoAcademicoModel from "../models/periodoAcademico.model.js";
import fs from 'fs'

async function obtenerPeriodoActivo() {
    return await periodoAcademicoModel.findOne({ estado: true }).lean()
}

const FILEPATH = 'public/uploads/'
const MIMETYPES = ['application/pdf']

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const periodo = await obtenerPeriodoActivo()
        req.periodo = periodo
        if (!fs.existsSync(FILEPATH + periodo.nombre)) fs.mkdirSync(FILEPATH + periodo.nombre);
        cb(null, FILEPATH + periodo.nombre)
    },
    filename: async function (req, file, cb) {
        const timestamp = Date.now().toString(); // Convertir la marca de tiempo a una cadena
        const randomChars = Math.random().toString(36).substring(2, 9); // Generar cadena aleatoria de 7 caracteres
        const FILENAME = `doc_${timestamp}_${randomChars}.pdf`;
        if (fs.existsSync(FILEPATH + FILENAME)) fs.unlinkSync(FILEPATH + FILENAME)
        req.nombreDocumento = FILENAME
        cb(null, FILENAME)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!MIMETYPES.includes(file.mimetype)) {
            return cb(new Error('Solo se permiten documentos de tipo .pdf'))
        }
        cb(null, true)
    },
    limits: {
        fileSize: 10000000,
        files: 1
    }
})

export default function (req, res, next) {
    upload.single('myFile')(req, res, function (err) {
        if (err) {
            if (err.code == 'LIMIT_FILE_SIZE') err.message = "El documento excede el tamaño permitido"
            if (err.code == 'LIMIT_FILE_COUNT') err.message = 'Solo se permite 1 documento'
            console.log(err)
            res.status(404).json({ message: err.message });
        } else {
            next();
        }
    });
};

