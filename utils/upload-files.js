import multer from "multer";
import periodoAcademicoModel from "../models/periodoAcademico.model.js";
import fs from 'fs'
import docenteModel from "../models/docente.model.js";

async function obtenerPeriodoActivo() {
    return await periodoAcademicoModel.findOne({ estado: true }).lean()
}

async function obtenerDocente(id) {
    return await docenteModel.findById(id)
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
        let signed = ''
        const docente = await obtenerDocente(req.user.docente)
        if (req.body.firmado_por == 'docente') {
            signed = 'SignedByDocente'
        }
        else if (req.body.firmado_por == 'director') {
            signed = 'SignedByDocenteAndDirector'
        } 
        else return cb(new Error("Proporcione si firmado_por es por 'docente' o 'director' "))
        const FILENAME = 'Informe-' + docente.primerNombre + '.' + docente.primerApellido + '-' + signed + '.pdf'
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

