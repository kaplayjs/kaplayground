import { assets } from "@kaplayjs/crew";
import { FileFolder } from "./FileFolder.tsx";

export const FileTree = () => {
    return (
        <div className="h-full bg-[#20252e] rounded-xl overflow-y-auto scrollbar-thin">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col p-2 rounded-xl mt-1">
                    <FileFolder
                        level={0}
                        title="Scenes"
                        kind="scene"
                        folded={false}
                        icon={assets.art.outlined}
                    />
                    <FileFolder
                        level={0}
                        title="Game Obj"
                        kind="object"
                        folded={false}
                        icon={assets.grass.outlined}
                    />
                    <FileFolder
                        level={0}
                        title="Utils"
                        kind="util"
                        folded={false}
                        icon={assets.toolbox.outlined}
                    />
                </div>

                <div className="flex flex-col p-2 gap-2">
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
                            onClick={() => {
                                alert("implement run");
                            }}
                        >
                            <kbd className="kbd kbd-xs">ctrl</kbd> +
                            <kbd className="kbd kbd-xs">s</kbd> to run
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
