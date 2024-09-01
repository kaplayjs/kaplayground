import { useMemo } from "react";
import type {
    Resource,
    ResourceKind,
    ResourcesSlice,
} from "../stores/storage/resoures";
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
        removeResource,
        addResource,
        project: { resources },
    } = useProject();

    const filteredResources = useMemo(() => {
        if (!kind) return resources;

        return resources.filter((r) => r.kind === kind);
    }, [resources, kind]);

    return {
        addResource,
        removeResource,
        resourcesLastId,
        resources: filteredResources,
    };
};
