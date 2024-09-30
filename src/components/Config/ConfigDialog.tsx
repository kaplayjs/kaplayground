import type { KAPLAYOpt } from "kaplay";
import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { useEditor } from "../../hooks/useEditor";
import { useProject } from "../../hooks/useProject";
import { stringToType, type Type } from "../../util/stringToType";
import ConfigCheckbox from "./ConfigCheckbox";
import ConfigGroup from "./ConfigGroup";
import ConfigInput from "./ConfigInput";
import { EditorConfig } from "./Sections/EditorConfig";

const ConfigDialog = () => {
    const {
        getKAPLAYConfig,
        updateKAPLAYConfig,
        syncKAPLAYFile,
        getProject,
    } = useProject();
    const {
        update,
    } = useEditor();

    const saveConfig = () => {
        const configInputs = document.querySelectorAll(".config-input");

        configInputs.forEach((input) => {
            const key = input.getAttribute("data-set-key") as keyof KAPLAYOpt;
            const value = input.getAttribute("data-set-value");
            const type = input.getAttribute("data-set-type") as Type;

            if (key && value) {
                updateKAPLAYConfig(key, stringToType(value, type));
            }
        });

        syncKAPLAYFile();
        update();
    };

    const updateInputs = () => {
        const configKeys = Object.keys(
            getKAPLAYConfig(),
        ) as (keyof KAPLAYOpt)[];

        configKeys.forEach((key) => {
            const value = getKAPLAYConfig()[key];
            const input = document.querySelector(
                `[data-set-key="${key}"]`,
            ) as HTMLInputElement;

            if (input) {
                input.value = value as string;
                input.checked = value as boolean;
            }
        });
    };

    const handleClose = () => {
        updateInputs();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClose();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <dialog id="config" className="modal">
            <main className="modal-box overflow-hidden px-0 py-0">
                <Tooltip id="config-dialog" />
                <section className="max-h-[400px] overflow-y-auto p-4">
                    <header className="flex items-center font-bold">
                        <h2 className="text-xl">KAPLAY Configuration</h2>
                    </header>
                    <main>
                        {getProject().mode === "pj"
                            ? (
                                <>
                                    <ConfigGroup title="screen & perf">
                                        <ConfigCheckbox
                                            configKey="letterbox"
                                            label="Letterbox?"
                                            tip={"Only works with defined\nwidth and height"}
                                        />
                                        <ConfigCheckbox
                                            configKey="stretch"
                                            label="Stretch?"
                                            tip="Only works with defined width and height"
                                        />
                                        <ConfigCheckbox
                                            configKey="crisp"
                                            label="Sharp Pixel Display?"
                                            tip={"Disable antialias and enable sharp pixel display."}
                                        />
                                        <div></div>
                                        <ConfigInput
                                            configKey="width"
                                            label="Width"
                                            type="number"
                                            placeholder="1080"
                                            tip="Leave empty for full screen"
                                        />
                                        <ConfigInput
                                            configKey="height"
                                            label="Height"
                                            type="number"
                                            placeholder="720"
                                            tip="Leave empty for full screen"
                                        />
                                        <ConfigInput
                                            configKey="pixelDensity"
                                            label="Pixel Density"
                                            type="number"
                                            placeholder="1"
                                            tip="High pixel density will hurt performance"
                                        />
                                    </ConfigGroup>

                                    <ConfigGroup title="debug">
                                        <ConfigCheckbox
                                            configKey="debug"
                                            label="Debug Mode?"
                                            tip="Enable debug mode"
                                            defaultValue={true}
                                        />
                                        <div></div>
                                        <ConfigInput
                                            label="Log Max"
                                            configKey="logMax"
                                            type="number"
                                            placeholder="10"
                                            defaultValue={8}
                                            tip="How many debug.log() messages can there be on the screen"
                                        />
                                        <ConfigInput
                                            label="Log Time"
                                            configKey="logTime"
                                            type="number"
                                            placeholder="5"
                                            defaultValue={4}
                                            tip="How many seconds log messages stay on screen."
                                        />
                                    </ConfigGroup>

                                    <ConfigGroup title="misc">
                                        <ConfigCheckbox
                                            configKey="backgroundAudio"
                                            label="Pause audio when tab is not active?"
                                            tip="Useful for games with background music"
                                        />
                                        <ConfigCheckbox
                                            configKey="focus"
                                            label="Autofocus?"
                                            defaultValue={true}
                                        />
                                        <ConfigCheckbox
                                            configKey="burp"
                                            label="Burp mode?"
                                        />
                                    </ConfigGroup>
                                </>
                            )
                            : (
                                <>
                                    KAPLAY Configuration are disabled in
                                    examples mode. Try Projects (toolbox) {"->"}
                                    {" "}
                                    Create Project
                                </>
                            )}
                    </main>

                    <div className="divider"></div>

                    <EditorConfig />
                </section>

                <footer className="p-4 bg-base-200">
                    <div className="modal-action">
                        <form method="dialog">
                            <button
                                className="btn btn-primary"
                                onClick={saveConfig}
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </footer>
            </main>
            <form
                method="dialog"
                className="modal-backdrop"
                onClick={handleClose}
            >
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ConfigDialog;
