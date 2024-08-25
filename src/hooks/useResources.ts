import { useEffect, useMemo } from "react";
import type {
    Resource,
    ResourceKind,
    ResourcesSlice,
} from "../stores/storage/resoures";
import { fileToBase64 } from "../util/fileToBase64";
import { useProject } from "./useProject";

type UseResourcesOpt = {
    kind?: ResourceKind;
};

type UseResourcesReturn = ResourcesSlice & {
    resources: Resource[];
};

type UseResourcesHook = (opt: UseResourcesOpt) => UseResourcesReturn;

export const useResources: UseResourcesHook = ({ kind }) => {
    const {
        resourcesLastId,
        resourcesUploading,
        uploadFileAsResource,
        uploadFilesAsResources,
        removeUploadingResource,
        removeResource,
        addResource,
        project: { resources },
    } = useProject();

    const filteredResources = useMemo(() => {
        if (!kind) return resources;

        return resources.filter((r) => r.kind === kind);
    }, [resources, kind]);

    useEffect(() => {
        if (resources.length === 0) return;

        resourcesUploading.forEach(async (asset) => {
            try {
                addResource({
                    name: asset.file.name,
                    url: await fileToBase64(asset.file),
                    kind: asset.kind,
                });

                removeUploadingResource(asset);
            } catch (e) {
                console.error(e);
            }
        });
    }, [resourcesUploading]);

    return {
        addResource,
        removeResource,
        uploadFileAsResource,
        removeUploadingResource,
        resourcesLastId,
        resourcesUploading,
        uploadFilesAsResources,
        resources: filteredResources,
    };
};
