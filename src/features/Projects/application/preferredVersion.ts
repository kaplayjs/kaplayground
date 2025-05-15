import { useConfig } from "../../../hooks/useConfig";
import { useEditor } from "../../../hooks/useEditor";

export function preferredVersion() {
    const versions = useEditor.getState().getRuntime().kaplayVersions;
    const preferredVersion = useConfig.getState().config.preferredVersion;

    return versions.find(v => v.startsWith(`${preferredVersion}.`))
        ?? versions[0];
}
