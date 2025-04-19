import type { StrictOmit } from "../../../shared/utils/types.ts";
import type { ProjectRepository } from "../../Project/ports/ProjectRepository.ts";
import type { File } from "../models/File.ts";

export async function createFile(
    repo: ProjectRepository,
    projectId: string,
    path: string,
    fileOpt: StrictOmit<File, "path" | "name">,
): Promise<File> {
    const pathMembers = path.split("/");
    const fileName = pathMembers.pop() ?? "file";

    const file: File = {
        name: fileName,
        path: `${fileOpt.kind}/${path}`,
        ...fileOpt,
    };

    return repo.createFile(projectId, file).then((file) => {
        return file;
    });
}
