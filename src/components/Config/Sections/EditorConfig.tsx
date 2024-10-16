import { type Packument } from "query-registry";
import { useEffect, useState } from "react";

async function getPackageInfo(name: string): Promise<Packument> {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
}

export const VersionSelector = () => {
    const [packageInfo, setPackageInfo] = useState<Packument | null>(
        null,
    );

    useEffect(() => {
        async function fetchPackageInfo() {
            const info = await getPackageInfo("kaplay");
            setPackageInfo(info);
            console.log(info.versions);
        }

        fetchPackageInfo();
    }, []);

    return (
        <select className="select select-bordered">
            {packageInfo
                && Object.keys(packageInfo.versions).map((version) => (
                    <option key={version} value={version}>
                        {version}
                    </option>
                ))}
        </select>
    );
};

// Configurations of the editor
export const EditorConfig = () => {
    const handleDeleteAllData = () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    return (
        <section>
            <header className="flex items-center font-bold">
                <h2 className="text-xl">Editor Configuration</h2>
            </header>

            <main className="py-4 flex flex-col gap-2">
                <button
                    className="btn btn-warning"
                    onClick={handleDeleteAllData}
                >
                    Delete All Data
                </button>
            </main>
        </section>
    );
};
