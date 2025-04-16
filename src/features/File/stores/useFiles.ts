// import { create } from "zustand";
// import type { FileCollection } from "../../../core/File/ports/FileCollection.ts";
// import { FileService } from "../../../core/File/services/FileService.ts";
// import { getFile } from "../storage/getFile.ts";
// import { saveFile } from "../storage/saveFile.ts";
// import { updateFile } from "../storage/updateFile.ts";

// interface FileStore extends FileCollection {
// }

// const fileService = new FileService();

// export const useFiles = create<FileStore>(() => ({
//     create(projectName, file) {
//         const createdFile = fileService.create(file);
//         projectName;
//         return createdFile;
//     },

//     update(projectName, file, newFile) {
//         const updatedFile = fileService.update(file, newFile);
//         const updatedFileInProject = updateFile(projectName, updatedFile);

//         return updatedFileInProject;
//     },

//     save(projectName, file) {
//         const savedFile = saveFile(projectName, file);

//         return savedFile;
//     },

//     get(projectName, filePath) {
//         return getFile(projectName, filePath);
//     },

//     has(projectName, filePath) {
//         return getFile(projectName, filePath) !== null;
//     },
// }));
