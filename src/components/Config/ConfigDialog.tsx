import { useProject } from "@/hooks/useProject";
import { stringToType, type Type } from "@/util/stringToType";
import type { KaboomOpt } from "kaboom";
import React from "react";
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
            <main className="modal-box">
                <section>
                    <header className="flex items-center font-bold">
                        <h2 className="text-xl">Kaboom Configuration</h2>
                    </header>
                    <div className="divider"></div>
                    <main>
                        <form>
                            <ConfigCheckbox
                                configKey="burp"
                                label="Burp mode?"
                            />
                            <ConfigInput
                                configKey="width"
                                label="Width"
                                type="number"
                                placeholder="Left empty for full screen"
                            />
                            <ConfigInput
                                configKey="height"
                                label="Height"
                                type="number"
                                placeholder="Left empty for full screen"
                            />
                        </form>
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
