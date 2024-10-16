import { Tooltip } from "react-tooltip";
import { EditorConfig } from "./Sections/EditorConfig";

const ConfigDialog = () => {
    return (
        <dialog id="config" className="modal">
            <main className="modal-box overflow-hidden px-0 py-0">
                <Tooltip id="config-dialog" />
                <section className="max-h-[400px] overflow-y-auto p-4">
                    <EditorConfig />
                </section>

                <footer className="p-4 bg-base-200">
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </footer>
            </main>
            <form
                method="dialog"
                className="modal-backdrop"
            >
                <button>Close</button>
            </form>
        </dialog>
    );
};

export default ConfigDialog;
