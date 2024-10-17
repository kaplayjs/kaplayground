import { useProject } from "../../hooks/useProject";
import { debug } from "../../util/logs";
import { Dialog } from "../UI/Dialog";
import { ConfigProject } from "./ConfigProject";

const ConfigDialog = () => {
    const { setProject } = useProject();

    const handleDeleteAllData = () => {
        if (confirm("Are you sure you want to delete all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    const handleSave = () => {
        const versionEl = document.querySelector<HTMLSelectElement>(
            "#version-selector",
        );

        if (!versionEl) return;

        const version = versionEl.value;
        debug(0, "Project KAPLAY version set to", version);
        setProject({ kaplayVersion: version });
    };

    return (
        <Dialog id="config" onSave={handleSave}>
            <ConfigProject />
            <div className="divider"></div>
            <h2 className="text-2xl font-bold pb-4">Misc configuration</h2>
            <button
                className="btn btn-warning"
                onClick={handleDeleteAllData}
            >
                Delete All Data
            </button>
        </Dialog>
    );
};

export default ConfigDialog;
