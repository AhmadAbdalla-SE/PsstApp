import { fileTypeFromBuffer } from 'file-type'
import multer from "multer"
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from "node:path"
import { BadException } from "../../exceptions/index.js"

export const fileValidation = {
    image:['image/jpeg', 'image/png', 'image/gif'],
    files:["application/pdf", "application/json"]
}
export const localFileUpload = ({maxFileSize = 5}={})=>{
    const storage =  multer.memoryStorage()

    return multer({ storage, limits:{fileSize:maxFileSize * 1024 * 1024}})
}
export const proccessFile = async ({customPath = "general", file,validation = []})=>{
    const result = await fileTypeFromBuffer(file.buffer)
    if(!result || !validation.includes(result.mime)){
        throw BadException("Invalid file format")
    } else {
        await mkdir(resolve(`./assets/${customPath}`), { recursive:true })
        const uniqueFilePath = `assets/${customPath}/${randomUUID()}.${result.ext}`
        await writeFile(resolve(`./${uniqueFilePath}`), file.buffer)
        file.path = uniqueFilePath
        return file
    }
}
export const proccessFiles = async ({customPath, files = [],validation = []})=>{
    const assets = []
    for (const file of files) {
        const uploadFile = await proccessFile({customPath, file, validation})
        assets.push(uploadFile)
    }
    return assets
}
export const proccessFields = async ({customPath, fields = {},validation = []})=>{
    const assets = []
    for (const field of Object.keys(fields)) {
       const files = await proccessFiles({customPath, files: fields[field], validation})
       assets.push({field, files})
    }
    return assets
}
export const proccessMulterUpload = async ({req, customPath = "users/profile", validation = []})=>{
    if (req.file){
        await proccessFile({customPath, file: req.file, validation})
    }
    else if (Array.isArray(req.files)){
        await proccessFiles({customPath, files: req.files, validation})
    }
    else if (typeof req.files == "object" && Object.keys(req.files ?? {} )?.length){
        await proccessFields({customPath, fields: req.files, validation})
    }
}




