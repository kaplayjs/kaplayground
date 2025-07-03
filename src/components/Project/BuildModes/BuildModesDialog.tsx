import { assets } from "@kaplayjs/crew";
import { Dialog } from "../../UI/Dialog";
import { ImportCodeExample } from "./ImportCodeExample";

export const BuildModesDialog = () => {
    return (
        <Dialog
            id="build-modes"
            mainClass="max-w-3xl overflow-x-hidden max-h-[calc(100vh-2rem)]"
            contentClass="p-8 pt-7"
        >
            <div>
                <h2 className="text-2xl text-white font-bold mb-3">
                    Build Modes
                </h2>

                <p>
                    Projects have a certain file structure which requires
                    different build modes.<br />
                    You can{" "}
                    <strong className="font-medium text-white">change</strong>
                    {" "}
                    mode, but it{" "}
                    <strong className="font-medium text-white">
                        will require you to update your code
                    </strong>{" "}
                    to continue working.
                </p>

                <div className="flex flex-wrap gap-px bg-base-50 p-px rounded-lg -m-6 mt-4">
                    <div className="sm:flex-1 w-full sm:w-auto space-y-3 p-6 bg-base-200 rounded-[inherit] min-w-0">
                        <h3 className="flex justify-between items-center font-semibold text-lg text-white">
                            Modern (ESBuild)

                            <img
                                src={assets.lightening.outlined}
                                height={28}
                                className="h-7 object-scale-down"
                                alt="Lightning bolt"
                            />
                        </h3>

                        <p>
                            New projects are automatically using ESBuild mode.
                            That requires files to be imported as you might be
                            used to from your other JS projects and regular code
                            editors.
                        </p>

                        <ImportCodeExample />

                        <p className="text-sm text-white/90">
                            If you are switching from Legacy mode, update all
                            your files in a similar way.
                        </p>
                    </div>

                    <div className="sm:flex-1 w-full sm:w-auto space-y-3 p-6 bg-base-200 rounded-[inherit]">
                        <h3 className="flex justify-between items-center font-semibold text-lg text-white">
                            Legacy (Simplified)

                            <img
                                src={assets.mushroom.outlined}
                                height={28}
                                className="h-7 object-scale-down"
                                alt="Mushroom"
                            />
                        </h3>

                        <p>
                            If your project was created before KAPLAYGROUND{" "}
                            <code className="inline-block align-middle -mt-0.5 font-mono text-xs bg-neutral px-2 py-0.5 rounded-md">
                                version 2.4
                            </code>, it is still using the old file structure
                            and build mode.
                        </p>

                        <p>
                            Simplified structure does not require each file in
                            your file tree to be imported. Files are loaded
                            automatically, but that comes with a minor drawback.
                            You have to order your files in a file tree as they
                            are needed.
                        </p>
                        <p className="text-sm text-white/90">
                            We strongly recommend you the Modern way that gives
                            you more control and is a coding standard.
                        </p>
                    </div>

                    <div className="flex gap-2 justify-between items-center w-full p-6 pl-4 bg-base-200 rounded-[inherit] border-l-8 border-lime-300/80">
                        <div className="space-y-0.5">
                            <p className="leading-snug">
                                If you still don't understand, then don't worry
                                about it and keep Build Mode as is.
                            </p>

                            <p className="text-sm">
                                Or, ask for more help on our{" "}
                                <a
                                    href="https://discord.com/invite/aQ6RuQm3TF"
                                    target="_blank"
                                    className="link hover:text-indigo-400 transition-colors"
                                >
                                    Discord
                                </a>.
                            </p>
                        </div>

                        <img
                            src={assets.mark.outlined}
                            height={28}
                            className="h-7 object-scale-down"
                            alt="Smiling Mark"
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
