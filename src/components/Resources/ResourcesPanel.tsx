import * as HUI from "@headlessui/react";
import { type FC } from "react";
import Dropzone from "react-dropzone";
import { useResources } from "../..//hooks/useResources";
import type { ResourceKind } from "../../stores/storage/resoures";
import { fileToBase64 } from "../../util/fileToBase64";
import ResourceAddButton from "./ResourceAddButton";
import ResourcesList from "./ResourcesList";

type Props = {
    kind: ResourceKind;
    visibleIcon?: string;
    accept: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const ResourcesPanel: FC<Props> = (props) => {
    const { addResource } = useResources({ kind: props.kind });

    const handleAssetUpload = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        acceptedFiles.forEach(async (file) => {
            try {
                addResource({
                    name: file.name,
                    url: await fileToBase64(file),
                    kind: props.kind,
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
                                onDragData={props.onDragData}
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
