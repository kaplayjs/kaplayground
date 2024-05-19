import { useProject } from "@/hooks/useProject";
import { stringToType, type Type } from "@/util/stringToType";
import type { KaboomOpt } from "kaboom";
import React from "react";
import { Tooltip } from "react-tooltip";
import ConfigCheckbox from "./ConfigCheckbox";
import ConfigInput from "./ConfigInput";

const ConfigDialog = () => {
    const [
        updateKaboomConfig,
    ] = useProject((state) => [
        state.updateKaboomConfig,
    ]);

    const saveConfig = () => {
        const configInputs = document.querySelectorAll(".config-input");

        configInputs.forEach((input) => {
            const key = input.getAttribute("data-set-key") as keyof KaboomOpt;
            const value = input.getAttribute("data-set-value");
            const type = input.getAttribute("data-set-type") as Type;

            if (key && value) {
                updateKaboomConfig(key, stringToType(value, type));
            }
        });
    };

    return (
        <dialog id="config" className="modal">
            <main className="modal-box overflow-hidden">
                <Tooltip id="config-dialog" />
                <section>
                    <header className="flex items-center font-bold">
                        <h2 className="text-xl">Kaboom Configuration</h2>
                    </header>
                    <main className=" overflow-y-auto">
                        <div className="divider">SCREEN</div>
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <div className="divider">MISC</div>
                        <ConfigCheckbox
                            configKey="focus"
                            label="Autofocus?"
                            defaultValue={true}
                        />
                        <ConfigCheckbox
                            configKey="burp"
                            label="Burp mode?"
                        />
                    </main>
                    <footer>
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
                </section>
            </main>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ConfigDialog;
