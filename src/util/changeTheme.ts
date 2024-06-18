export type Theme = "kaplayrk" | "kaplight";

export const changeTheme = (theme?: Theme) => {
    // parent element
    const parent = document.documentElement;
    // set data-theme attribute
    parent.setAttribute("data-theme", theme ?? "kaplayrk");
};
