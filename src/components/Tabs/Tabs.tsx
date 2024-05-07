import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { FC } from "react";
import soundIcon from "../../assets/sound_icon.png";
import soundsIcon from "../../assets/sounds_icon.png";
import spritesIcon from "../../assets/sprites_icon.png";
import AssetsTab from "./AssetsTab";

type TabProps = {
    label: string;
    icon: string;
};

const TTab: FC<TabProps> = ({ label, icon }) => {
    return (
        <Tab className="tab px-12 data-[selected]:tab-active ">
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
        <TabGroup className="hidden md:flex flex-col h-[30%]">
            <div className="bg-base-200">
                <TabList className="tabs tabs-boxed w-min">
                    <TTab label="Sprites" icon={spritesIcon.src} />
                    <TTab label="Sounds" icon={soundsIcon.src} />
                </TabList>
            </div>
            <TabPanels className="flex-1">
                <TabPanel className="h-full">
                    <AssetsTab
                        kind="sprite"
                        onDragData={(name, url) =>
                            `loadSprite("${name}", "${url}")`}
                    />
                </TabPanel>
                <TabPanel>
                    <AssetsTab
                        kind="sound"
                        onDragData={(name, url) =>
                            `loadSound("${name}", "${url}")`}
                        visibleIcon={soundIcon.src}
                    />
                </TabPanel>
                <TabPanel>Content 3</TabPanel>
            </TabPanels>
        </TabGroup>
    );
};

export default Tabs;
