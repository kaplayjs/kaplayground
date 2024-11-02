import { View } from "../UI/View";
import { FileFold } from "./FileFold";

export const FileTree = () => {
    return (
        <View direction={"column"} justify="between" height="full" el={"div"}>
            <View direction={"column"} padding={2} gap={2} el="div">
                <FileFold
                    level={1}
                    title="Scenes"
                    folder="scenes"
                    kind="scene"
                    toolbar
                />
                <FileFold
                    level={1}
                    title="Game Objs"
                    folder="objects"
                    kind="obj"
                    toolbar
                />
                <FileFold
                    level={1}
                    title="Utils"
                    folder="utils"
                    kind="util"
                    toolbar
                />
                <FileFold
                    folder="root"
                    level={0}
                />
            </View>

            <View direction="column" padding={2} gap={2} el={"div"}>
                <ul className="flex flex-col font-bold">
                    <li className="link link-primary">
                        <a
                            href="https://github.com/kaplayjs/kaplayground/wiki"
                            target="_blank"
                        >
                            Wiki (?)
                        </a>
                    </li>
                    <li className="link link-primary">
                        <a href="https://kaplayjs.com" target="_blank">
                            KAPLAY Docs
                        </a>
                    </li>
                    <li className="link link-primary">
                        <a
                            href="https://discord.com/invite/aQ6RuQm3TF"
                            target="_blank"
                        >
                            Discord
                        </a>
                    </li>
                    <li className="text-primary">
                        <kbd className="kbd kbd-xs">ctrl</kbd> +{" "}
                        <kbd className="kbd kbd-xs">s</kbd> to run
                    </li>
                </ul>
            </View>
        </View>
    );
};
