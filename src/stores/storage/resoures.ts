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

    addResource(resource) {
        const foundResource = get().project.resources[resource.name];

        if (foundResource) {
            set((state) => ({
                project: {
                    ...state.project,
                    resources: {
                        ...state.project.resources,
                        [`${resource.kind}/${resource.name}`]: {
                            id: foundResource.id,
                            kind: resource.kind,
                            name: resource.name,
                            url: resource.url,
                        },
                    },
                },
            }));
        } else {
            set((state) => ({
                project: {
                    ...state.project,
                    resources: {
                        ...state.project.resources,
                        [`${resource.kind}/${resource.name}`]: {
                            id: state.resourcesLastId + 1,
                            kind: resource.kind,
                            name: resource.name,
                            url: resource.url,
                        },
                    },
                },
                resourcesLastId: state.resourcesLastId + 1,
            }));
        }
    },
    removeResource(resourceId) {
        set((state) => ({
            project: {
                ...state.project,
                resources: Object.fromEntries(
                    Object.entries(state.project.resources).filter(
                        ([, resource]) => resource.id !== resourceId,
                    ),
                ),
            },
        }));
    },
});
