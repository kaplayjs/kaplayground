import { type FC, type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    title: string;
}>;

const ConfigGroup: FC<Props> = ({ children, title }) => {
    return (
        <>
            <div className="divider">{title.toUpperCase()}</div>
            <div className="grid grid-cols-2 gap-4">
                {children}
            </div>
        </>
    );
};

export default ConfigGroup;
