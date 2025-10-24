export type ConditionalWrapProps = {
    condition: boolean | undefined;
    wrap: (children: React.ReactNode) => React.ReactElement | null;
    children: React.ReactNode;
};

export const ConditionalWrap = (
    { condition, wrap, children }: ConditionalWrapProps,
) => condition ? wrap(children) : <>{children}</>;
