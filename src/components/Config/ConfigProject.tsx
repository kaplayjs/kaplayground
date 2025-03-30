import { type Packument } from "query-registry";
import { useEffect, useState } from "react";
import { useEditor } from "../../hooks/useEditor.ts";
import { useProject } from "../../hooks/useProject";

async function getPackageInfo(name: string): Promise<Packument> {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
}

export const ConfigProject = () => {
    const [packageInfo, setPackageInfo] = useState<Packument | null>(
        null,
    );
    const { project: project } = useProject();
    const { setRuntime } = useEditor();

    useEffect(() => {
        async function fetchPackageInfo() {
            const info = await getPackageInfo("kaplay");
            setPackageInfo(info);
            setRuntime({
                kaplayVersions: Object.keys(info.versions).reverse(),
            });
        }

        fetchPackageInfo();
    }, []);

    return (
        <>
            <h2 className="text-2xl font-bold pb-4">Project configuration</h2>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">
                        KAPLAY.js version:
                    </span>
                </div>
                <select
                    id="version-selector"
                    className="select select-bordered"
                    defaultValue={"none"}
                >
                    <option disabled value={"none"}>
                        Select a version
                    </option>
                    <option value={"master"}>
                        master
                    </option>
                    {packageInfo
                        && Object.keys(packageInfo.versions).reverse().map((
                            version,
                        ) => (
                            <option key={version} value={version}>
                                {version}
                            </option>
                        ))}
                </select>
                <div className="label">
                    <span className="label-text">
                        Current version: {project.kaplayVersion}
                    </span>
                    <span>Now you can share links with version!</span>
                </div>
            </label>
        </>
    );
};
