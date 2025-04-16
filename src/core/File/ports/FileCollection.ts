import type { File } from "../models/File.ts";

export interface FileCollection {
    /**
     * Add a new file to a project
     *
     * @param projectName The name of the project to add file
     * @param fileValue The file to create
     */
    create(projectName: string, file: File): File;
    /**
     * Update an existent file in a project
     *
     * @param projectName The name of the project to update file
     * @param file The file to update
     * @param newFile An object with the properties to update
     */
    update(
        projectName: string,
        file: File,
        newFile: Partial<File>,
    ): File | null;
    /**
     * Get a file
     *
     * @param projectName The name of the project to get file
     * @param filePath The path of the file
     */
    get(projectName: string, filePath: string): File | null;
    /**
     * Check if file exists
     *
     * @param projectName The name of the project to check file
     * @param filePath The path of the file
     */
    has(projectName: string, filePath: string): boolean;
}
