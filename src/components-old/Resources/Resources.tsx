import fontsTabIcon from "@/assets/tabs/fonts.png";
import soundsTabIcon from "@/assets/tabs/sounds.png";
import spritesTabIcon from "@/assets/tabs/sprites.png";
import * as HUI from "@headlessui/react";
import ResourcesPanel from "./ResourcesPanel";
import ResourceTab from "./ResourceTab";

const Resources = () => {
    return (
        <HUI.TabGroup className="flex flex-col h-full">
            <HUI.TabList className="tabs tabs-bordered bg-base-200 w-full">
                <ResourceTab label="Sprites" icon={spritesTabIcon.src} />
                <ResourceTab label="Sounds" icon={soundsTabIcon.src} />
                <ResourceTab label="Fonts" icon={fontsTabIcon.src} />
            </HUI.TabList>
            <HUI.TabPanels className="flex-1 flex">
                <ResourcesPanel
                    kind="sprite"
                    onDragData={(name, url) =>
                        `\nloadSprite("${name}", "${url}")`}
                    accept="image/*"
                />
                <ResourcesPanel
                    kind="sound"
                    onDragData={(name, url) =>
                        `\nloadSound("${name}", "${url}")`}
                    visibleIcon={soundsTabIcon.src}
                    accept="audio/*"
                />
                <ResourcesPanel
                    kind="font"
                    onDragData={(name, url) =>
                        `\nloadSound("${name}", "${url}")`}
                    visibleIcon={fontsTabIcon.src}
                    accept=".ttf,.otf"
                />
            </HUI.TabPanels>
        </HUI.TabGroup>
    );
};

export default Resources;
