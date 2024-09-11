import * as HUI from "@headlessui/react";
import { type FC } from "react";
import Dropzone from "react-dropzone";
import { useAssets } from "../../hooks/useAssets";
import type { AssetKind } from "../../stores/storage/assets";
import { fileToBase64 } from "../../util/fileToBase64";
import ResourceAddButton from "./ResourceAddButton";
import ResourcesList from "./ResourcesList";

type Props = {
    kind: AssetKind;
    visibleIcon?: string;
    accept: string;
};

const ResourcesPanel: FC<Props> = (props) => {
    const { addAsset } = useAssets({ kind: props.kind });

    const handleAssetUpload = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        acceptedFiles.forEach(async (file) => {
            try {
                addAsset({
                    name: file.name,
                    url: await fileToBase64(file),
                    kind: props.kind,
                    path: `${props.kind}s/${file.name}`,
                });
            } catch (e) {
                console.error(e);
            }
        });
    };

    return (
        <HUI.TabPanel className="w-full h-full">
            <Dropzone onDrop={handleAssetUpload} noClick>
                {({ getRootProps, getInputProps }) => (
                    <div
                        className="h-full p-2"
                        {...getRootProps()}
                    >
                        <div className="h-full flex flex-col justify-between">
                            <ResourcesList
                                kind={props.kind}
                                visibleIcon={props.visibleIcon}
                            />
                            <ResourceAddButton
                                accept={props.accept}
                                kind={props.kind}
                                inputProps={getInputProps()}
                            />
                        </div>
                    </div>
                )}
            </Dropzone>
        </HUI.TabPanel>
    );
};

export default ResourcesPanel;
