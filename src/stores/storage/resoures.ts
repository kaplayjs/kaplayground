import type { StateCreator } from "zustand";
import type { ProjectSlice } from "../project";

/** The Resource's id */
export type ResourceId = number;
/** The Resources's kind */
export type ResourceKind = "sprite" | "sound" | "font";

export type UploadResource = {
    // name of the resource including the extension
    name: string;
    // the url of the resource, base64 encoded
    url: string;
    // the kind of the resource (will determine the folder)
    kind: ResourceKind;
};

export type Resource = UploadResource & {
    id: ResourceId;
};

export type ResourceFile = {
    file: File;
    kind: ResourceKind;
};

export interface ResourcesSlice {
    /** Last resource ID */
    resourcesLastId: ResourceId;
    /** Resources that are uploading */
    resourcesUploading: ResourceFile[];
    /** Upload a resource */
    uploadFileAsResource: (file: File, kind: ResourceKind) => void;
    /** Upload resources */
    uploadFilesAsResources: (files: File[], kind: ResourceKind) => void;
    /** Remove an uploading resource */
    removeUploadingResource: (resource: ResourceFile) => void;
    /** Add a resource */
    addResource: (resource: UploadResource) => void;
    /** Remove a resource */
    removeResource: (resourceId: ResourceId) => void;
}

type Slice = ProjectSlice & ResourcesSlice;

export const createResourcesSlice: StateCreator<
    Slice,
    [],
    [],
    ResourcesSlice
> = (
    set,
    get,
) => ({
    resourcesLastId: 0,
    resourcesUploading: [],
    uploadFileAsResource(file, kind) {
        set((state) => ({
            resourcesUploading: [...state.resourcesUploading, { file, kind }],
        }));
    },
    uploadFilesAsResources(files, kind) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            get().uploadFileAsResource(file, kind);
        }
    },
    removeUploadingResource(resource) {
        set((state) => ({
            resourcesUploading: state.resourcesUploading.filter(
                (r) => r !== resource,
            ),
        }));
    },
    addResource(resource) {
        const foundResource = get().resourcesUploading.find(
            (r) => r.file.name === resource.name,
        );

        if (foundResource) {
            set((state) => ({
                project: {
                    ...state.project,
                    resources: [
                        ...state.project.resources,
                        {
                            id: state.resourcesLastId,
                            ...resource,
                        },
                    ],
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    resources: [
                        ...state.project.resources,
                        {
                            id: state.resourcesLastId + 1,
                            ...resource,
                        },
                    ],
                },
                resourcesLastId: state.resourcesLastId + 1,
            }));
        }
    },
    removeResource(resourceId) {
        set((state) => ({
            project: {
                ...state.project,
                resources: state.project.resources.filter(
                    (r) => r.id !== resourceId,
                ),
            },
        }));
    },
});
