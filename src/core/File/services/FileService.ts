import type { File } from "../models/File.ts";

export class FileService {
    create(file: File): File {
        return file;
    }

    update(file: File, newFileProps: Partial<File>): File {
        return {
            ...file,
            ...newFileProps,
        };
    }
}
