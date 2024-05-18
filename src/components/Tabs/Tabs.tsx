import fontsTabIcon from "@/assets/icons/tabs/fonts_tab_icon.png";
import soundIcon from "@/assets/sound_icon.png";
import soundsIcon from "@/assets/sounds_icon.png";
import spritesIcon from "@/assets/sprites_icon.png";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { FC } from "react";
import AssetsTab from "./AssetsTab";

type TabProps = {
    label: string;
    icon: string;
};

const TTab: FC<TabProps> = ({ label, icon }) => {
    return (
        <Tab className="tab px-12 data-[selected]:tab-active">
            <div className="flex gap-2">
                <p className="inline font-medium">{label}</p>
                <img
                    src={icon}
                    alt={label}
                    className="inline h-6"
                />
            </div>
        </Tab>
    );
};

const Tabs = () => {
    return (
        <TabGroup className="flex flex-col h-full">
            <div className="bg-base-200">
                <TabList className="tabs tabs-bordered w-min">
                    <TTab label="Sprites" icon={spritesIcon.src} />
                    <TTab label="Sounds" icon={soundsIcon.src} />
                    <TTab label="Fonts" icon={fontsTabIcon.src} />
                </TabList>
            </div>
            <TabPanels className="flex-1 flex">
                <TabPanel className="w-full h-full">
                    <AssetsTab
                        kind="sprite"
                        onDragData={(name, url) =>
                            `\nloadSprite("${name}", "${url}")`}
                        accept="image/*"
                    />
                </TabPanel>
                <TabPanel className="w-full">
                    <AssetsTab
                        kind="sound"
                        onDragData={(name, url) =>
                            `\nloadSound("${name}", "${url}")`}
                        visibleIcon={soundIcon.src}
                        accept="audio/*"
                    />
                </TabPanel>
                <TabPanel className="w-full">
                    <AssetsTab
                        kind="font"
                        onDragData={(name, url) =>
                            `\nloadSound("${name}", "${url}")`}
                        visibleIcon={fontsTabIcon.src}
                        accept=".ttf,.otf"
                    />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
};

export default Tabs;
