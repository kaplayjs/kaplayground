import { assets } from "@kaplayjs/crew";
import { useEditor } from "../../hooks/useEditor";
import { View } from "../UI/View";
import { FileFold } from "./FileFold";

export const FileTree = () => {
    const run = useEditor((s) => s.run);

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
                className=""
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
                        title="scenes"
                        folder="scenes"
                        kind="scene"
                        toolbar
                    />
                    <FileFold
                        level={1}
                        title="objects"
                        folder="objects"
                        kind="obj"
                        toolbar
                    />
                    <FileFold
                        level={1}
                        title="utils"
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
