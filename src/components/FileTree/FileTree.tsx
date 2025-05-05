import { assets } from "@kaplayjs/crew";
import { useEditor } from "../../hooks/useEditor";
import { View } from "../UI/View";
import { FileFold } from "./FileFold";

export const FileTree = () => {
    const { run } = useEditor();

    return (
        <View
            el={"div"}
            height="full"
            className="bg-[#20252e] rounded-xl overflow-y-auto scrollbar-thin"
        >
            <View
                direction={"column"}
                justify="between"
                height="full"
                el={"div"}
            >
                <View
                    direction={"column"}
                    padding={2}
                    gap={1.5}
                    el="div"
                    rounded={"xl"}
                    className="mt-1"
                >
                    <FileFold
                        level={1}
                        title="Scenes"
                        path="scenes"
                        icon={assets.art.outlined}
                    />
                    <FileFold
                        level={1}
                        title="Game Objs"
                        path="objects"
                        icon={assets.grass.outlined}
                    />
                    <FileFold
                        level={1}
                        title="Utils"
                        path="utils"
                        icon={assets.toolbox.outlined}
                    />
                    <FileFold
                        level={0}
                        path="root"
                        folded={false}
                    />
                </View>

                <View direction="column" padding={2} gap={2} el={"div"}>
                    <ul className="flex flex-col gap-px">
                        <li>
                            <a
                                href="https://github.com/kaplayjs/kaplayground/wiki"
                                target="_blank"
                                className="btn btn-xs btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto"
                            >
                                <img
                                    src={assets.api_book.outlined}
                                    className="h-4 w-4 object-scale-down"
                                    aria-hidden="true"
                                />
                                Wiki (?)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://kaplayjs.com"
                                target="_blank"
                                className="btn btn-xs btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto"
                            >
                                <img
                                    src={assets.marks_legend.outlined}
                                    className="h-4 w-4 object-scale-down"
                                    aria-hidden="true"
                                />
                                KAPLAY Docs
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://discord.com/invite/aQ6RuQm3TF"
                                target="_blank"
                                className="btn btn-xs btn-ghost justify-start font-medium px-2 py-1.5 w-full h-auto"
                            >
                                <img
                                    alt="KAPLAYGROUND"
                                    src={assets.discord.outlined}
                                    className="h-4 w-4 object-scale-down"
                                />
                                Discord
                            </a>
                        </li>
                        <li
                            className="btn btn-xs btn-ghost justify-start -m-px mt-1 px-1 py-1 font-normal text-xs text-white/80 h-auto gap-1"
                            role="button"
                            tabIndex={0}
                            onClick={run}
                        >
                            <kbd className="kbd kbd-xs">ctrl</kbd> +
                            <kbd className="kbd kbd-xs">s</kbd> to run
                        </li>
                    </ul>
                </View>
            </View>
        </View>
    );
};
