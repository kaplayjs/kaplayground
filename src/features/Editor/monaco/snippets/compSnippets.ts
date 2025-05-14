type CompCompletionData = {
    prettyName: string;
    description: string;
    template: string;
};

export const compMap: Record<string, CompCompletionData> = {
    "pos": {
        prettyName: "pos(x, y)",
        description: "Set a coords on screen",
        template: "pos(${1:x}, ${2:y}),",
    },
    "scale": {
        prettyName: "scale(s)",
        description: "Set how big it is",
        template: "scale(${1:s}),",
    },
    "rotate": {
        prettyName: "rotate(r)",
        description: "Set the angle",
        template: "rotate(${1:r}),",
    },
    "color": {
        prettyName: "color(\"#00ff00\")",
        description: "Set a color",
        template: "color(\"#${1:}\"),",
    },
    "sprite": {
        prettyName: "sprite(\"mark\")",
        description: "Render an image",
        template: "sprite(\"${1:sprite}\"),",
    },
    "text": {
        prettyName: "text(\"ohhi\")",
        description: "Render a text",
        template: "sprite(\"${1:sprite}\"),",
    },
    "polygon": {
        prettyName: "polygon([x, y])",
        description: "Render a polygon",
        template: "polygon([vec2(0,0), vec2(50,0), vec2(50,50), vec2(0,50)]),",
    },
    "rect": {
        prettyName: "rect(w, h)",
        description: "Render a rectangle",
        template: "rect(${1:w}, ${2:h}),",
    },
    "circle": {
        prettyName: "circle(r)",
        description: "Render a circle",
        template: "circle(${1:r}),",
    },
    "uvquad": {
        prettyName: "uvquad(w, h)",
        description: "Render a uvquad",
        template: "uvquad(${1:w}, ${2:h}),",
    },
    "area": {
        prettyName: "area()",
        description: "Set an area",
        template: "area(),",
    },
    "anchor": {
        prettyName: "anchor(\"center\")",
        description: "Set an anchor",
        template: "anchor(\"${1:center}\"),",
    },
    "z": {
        prettyName: "z(z)",
        description: "Set a z index",
        template: "z(${1:z}),",
    },
    "outline": {
        prettyName: "outline(w)",
        description: "Set an outline",
        template: "outline(${1:w}),",
    },
    "particles": {
        prettyName: "particles()",
        description: "Set particles",
        template: "particles(todo),",
    },
    "body": {
        prettyName: "body()",
        description: "Set a body for physics (req: area())",
        template: "body(),",
    },
    "doubleJump": {
        prettyName: "doubleJump(numJumps?)",
        description: "Set a double jump (req: body())",
        template: "doubleJump(${1}),",
    },
    "move": {
        prettyName: "move(dir, speed)",
        description: "Set a move (req: body())",
        template: "move(${1:vec2(10, 10)}, ${speed:100}),",
    },
    "offscreen": {
        prettyName: "offscreen()",
        description: "Make it do stuff when it's offscreen",
        template: "offscreen(),",
    },
    "follow": {
        prettyName: "follow(obj, offset)",
        description: "Make it follow another obj",
        template: "follow(${1:obj}, ${2:vec2(0, 0)}),",
    },
    "shader": {
        prettyName: "shader(\"name\")",
        description: "Set a shader",
        template: "shader(\"${1:shader}\"),",
    },
    "textInput": {
        prettyName: "textInput(hasFocus, maxLength)",
        description: "Make it a text input",
        template: "textInput(),",
    },
    "timer": {
        prettyName: "timer()",
        description: "Give it wait, loop and tween in obj",
        template: "timer(),",
    },
    "stay": {
        prettyName: "stay()",
        description: "Make it stay in scene change",
        template: "stay(),",
    },
    "health": {
        prettyName: "health(hp)",
        description: "Give it health",
        template: "health(${1:hp}),",
    },
    "lifespan": {
        prettyName: "lifespan(time)",
        description: "Make it die in time",
        template: "lifespan(${1:time}),",
    },
    "named": {
        prettyName: "named(name)",
        description: "Give it a name",
        template: "named(${1:name}),",
    },
    "state": {
        prettyName: "state()",
        description: "Give it a state machine",
        template: "state(${1:name}),",
    },
    "mask": {
        prettyName: "mask(maskType?)",
        description: "Make it a mask",
        template: "mask(${1}),",
    },
    "drawon": {
        prettyName: "drawon(canvas)",
        description: "Make it draw on another framebuffer",
        template: "drawon(${1:canvas}),",
    },
    "tile": {
        prettyName: "tile()",
        description: "Make it a tile in a tilemap",
        template: "tile(),",
    },
    "agent": {
        prettyName: "agent()",
        description: "Make it an agent",
        template: "agent(),",
    },
    "animate": {
        prettyName: "animate()",
        description: "Make it animate. My fav comp 😇",
        template: "animate(${1:anim}),",
    },
    "sentry": {
        prettyName: "sentry()",
        description: "Make it a sentry in pathfinding",
        template: "sentry(),",
    },
    "path": {
        prettyName: "path()",
        description: "Make it a path in pathfinding",
        template: "path(),",
    },
    "pathfinder": {
        prettyName: "pathfinder()",
        description: "Make it a pathfinder in pathfinding",
        template: "pathfinder(),",
    },
};
