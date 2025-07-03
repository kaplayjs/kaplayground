import { openDialog } from "../../../util/openDialog";
import { ImportCodeExample } from "./ImportCodeExample";

const LearnMore = () => (
    <p className="text-sm">
        <button
            className="link hover:text-white transition-colors"
            onClick={() => openDialog("build-modes")}
        >
            Learn more
        </button>{" "}
        about both build modes, or ask for help on our{" "}
        <a
            href="https://discord.com/invite/aQ6RuQm3TF"
            target="_blank"
            className="link hover:text-indigo-400 transition-colors"
        >
            Discord
        </a>.
    </p>
);

export const BuildModeModern = () => (
    <>
        <p>
            You will have to{" "}
            <strong className="font-medium text-white">
                update all your files
            </strong>{" "}
            in the file tree with imports. For example, the main file:
        </p>

        <ImportCodeExample />

        <LearnMore />
    </>
);

export const BuildModeLegacy = () => (
    <>
        <p>
            You will have to{" "}
            <strong className="font-medium text-white">
                update all your files
            </strong>{" "}
            in the file tree and remove all imports.
        </p>
        <p className="font-light">
            You might also have to{" "}
            <strong className="font-regular text-white">
                reorder your files
            </strong>{" "}
            in the file tree, if you run into any issues. E.g. if your object
            references another, the second one has to appear in the tree
            earlier.
        </p>

        <LearnMore />
    </>
);
