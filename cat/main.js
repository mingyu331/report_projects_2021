// TODO: Move to angular
// TODO: Make it move smoothly
// TODO: Make the cat change direction

let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Runner = Matter.Runner,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

let engine = Engine.create();
engine.gravity = { x: 0, y: 0 };

let balls = [];
let objectives = [];
for (let i = 0; i < 200; i++) {
    balls.push(Bodies.circle(0, 0, 32));
    objectives.push({ x: 0, y: 0, timeout: 1, delay: 0 });
}

let border = [
    // left
    Bodies.rectangle(-50, document.body.clientHeight / 2, 100, document.body.clientHeight, { isStatic: true }),
    // top
    Bodies.rectangle(document.body.clientWidth / 2, -50, document.body.clientWidth, 100, { isStatic: true }),
    // right
    Bodies.rectangle(document.body.clientWidth + 50, document.body.clientHeight / 2, 100, document.body.clientHeight, { isStatic: true }),
    // bottom
    Bodies.rectangle(document.body.clientWidth / 2, document.body.clientHeight + 50, document.body.clientWidth, 100, { isStatic: true }),
];

World.add(engine.world, border);

Runner.run(engine);

let mouse = Mouse.create(document.body);
// let mouse = { position: { x: document.body.clientWidth / 2, y: document.body.clientHeight / 2 } };
let prevTime = 0,
    i = 0;

let container = document.getElementById("container");

let ball_elements = [];

Events.on(engine, "afterUpdate", function (event) {
    for (let idx = 0; idx < balls.length; idx++) {
        Body.setVelocity(balls[idx], {
            x: Math.min(Math.max(objectives[idx].x - balls[idx].position.x, -300), 300) / 50,
            y: Math.min(Math.max(objectives[idx].y - balls[idx].position.y, -300), 300) / 50,
        });
        if (event.timestamp > objectives[idx].timeout && objectives[idx].timeout) {
            objectives[idx].timeout = 0;
            // update objectives
            setTimeout(() => {
                objectives[idx].x = mouse.position.x + (2 * Math.random() - 1) * 32;
                objectives[idx].y = mouse.position.y + (2 * Math.random() - 1) * 32;
                // objectives[idx].x = document.body.clientWidth * Math.random();
                // objectives[idx].y = document.body.clientHeight * Math.random();
                objectives[idx].delay = Math.random() * 2000;
                objectives[idx].timeout = event.timestamp + Math.random() * 1000;
            }, objectives[idx].delay);
        }
    }
    // update element
    for (let idx = 0; idx < ball_elements.length; idx++) {
        ball_elements[idx].style.left = balls[idx].position.x + 8 + "px";
        ball_elements[idx].style.top = balls[idx].position.y + 8 + "px";
    }
    // repeat every 100 ms
    if (prevTime + 100 < event.timestamp && i < 100) {
        prevTime = event.timestamp;
        // add new cat
        World.add(engine.world, [balls[i++]]);
        let element = document.createElement("div");
        element.className = "circle";
        let index = String(i);
        element.onclick = () => {
            console.log(`you clicked on the ${index}th cat`);
        };
        container.appendChild(element);
        ball_elements.push(element);
    }
});
