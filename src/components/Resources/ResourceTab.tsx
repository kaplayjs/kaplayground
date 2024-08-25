import * as HUI from "@headlessui/react";
import type { FC } from "react";

type TabProps = {
    label: string;
    icon: string;
};

const ResourceTab: FC<TabProps> = ({ label, icon }) => {
    return (
        <HUI.Tab className="tab px-12 data-[selected]:tab-active">
            <div className="flex gap-2 items-center justify-center">
                <p className="inline font-medium">{label}</p>
                <img
                    src={icon}
                    alt={label}
                    className="inline h-5 w-5 object-scale-down"
                />
            </div>
        </HUI.Tab>
    );
};

export default ResourceTab;
