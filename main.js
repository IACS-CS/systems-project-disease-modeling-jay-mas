/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: [Your Name(s) Here] */
/* Description: [Short description of your game here] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] */
/* AI Use: describe what you asked, what it gave you, and what you changed. */
/* Mark AI-generated sections: // AI-generated: ... // end AI-generated   */

import "./style.css";
import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* --- STATE ------------------------------------------------------------ */

let infectionRate = 0.5;
let population = [];
let roundCount = 0;
let infectedPerRound = [1];
let incubationperiod = 8;
/* --- COORDINATE HELPER ------------------------------------------------
 *
 * Positions in your simulation are "percent coordinates": x and y
 * run from 0 to 100, where (0,0) is the top-left of any region.
 * percentToPixels() converts those to actual canvas pixels for a
 * given bounds object: { top, bottom, left, right }
 *
 * Examples (bounds = { top:0, bottom:400, left:0, right:800 }):
 *   percentToPixels(  0,   0, bounds) --> { x:   0, y:   0 }
 *   percentToPixels(100, 100, bounds) --> { x: 800, y: 400 }
 *   percentToPixels( 50,  50, bounds) --> { x: 400, y: 200 }
 *
 * @param {number} x
 * @param {number} y
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @returns {{x:number, y:number}}
 */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}

/* --- DRAWING: SIMULATION ----------------------------------------------
 *
 * Draw your agents inside the simulation area.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @param {number} elapsed - ms since simulation started
 */
function drawSimulation(ctx, bounds, elapsed) {
  // Draw a border around the simulation area...
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y,
  );

  // Example: utility function to draw a person as a circle
  function drawPerson(px, py, color, person) {
    let { x, y } = percentToPixels(px, py, bounds);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`${person.incubationTime}`, x + 8, y - 8);
  }

  // Now we draw some people...
  // (in your real code you'll replace this with a loop)
  // like...
  // for (let person of population) {...}
  for (let person of population) {
    let color = "green";
    if (person.incubationTime > 0) {
      color = "orange";
    } else if (person.infected) {
      color = "red";
    }
    drawPerson(person.x, person.y, color, person);
  }
}

/* --- DRAWING: GRAPH ---------------------------------------------------
 *
 * Draw a bar chart in the graph area.
 * data[] is a list of values (e.g. infectedPerRound).
 * dataMax is the largest possible value (e.g. population.length).
 *
 * This is a good CREATE task candidate -- try calling it with
 * fake data to see how changing the arguments changes the output.
 *
 * @param {number[]} data
 * @param {number} dataMax
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 */
function drawGraph(data, dataMax, ctx, bounds) {
  // Axes
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomLeft = percentToPixels(0, 100, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.stroke();

  // YOUR CODE HERE
  // Hint: let pct = (data[i] / dataMax) * 100;
}

/* --- DRAWING: HUD -----------------------------------------------------
 *
 * Optional text overlay. Delete if you don't need it.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function drawHUD(ctx, width, height) {
  // YOUR CODE HERE
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "red";
  let text = `Simulation - Infection Rate: ${infectionRate.toFixed(2)}, round ${roundCount}`;
  ctx.font = "16pt sans-serif";
  ctx.strokeText(text, 15, 25);
  ctx.fillText(text, 15, 25);
}

/* --- REGISTERED DRAWING CALLBACKS -------------------------------------
 * You shouldn't need to change these.
 * Adjust the bounds values if you want to resize the regions.
 */

gi.addDrawing(function ({ ctx, width, height, elapsed }) {
  let simBounds = {
    top: 30,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawSimulation(ctx, simBounds, elapsed);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height - 50,
    left: 50,
    right: width - 50,
  };
  drawGraph([], 1, ctx, graphBounds); // <- replace [] and 1 with your real data
});

gi.addDrawing(function ({ ctx, width, height }) {
  drawHUD(ctx, width, height);
});

/* --- SIMULATION LOGIC -------------------------------------------------
 *
 * Write functions to update your population each round.
 * Your CREATE task function must have a parameter that affects
 * its behavior, sequencing, selection (if/else), iteration (loop),
 * and an explicit call with arguments somewhere in your code.
 */

// YOUR CODE HERE
function spreadInfection() {
  for (let person of population) {
    let IDX = Math.floor(Math.random() * population.length);
    let partner = population[IDX];
    if (person.infected === true && partner.infected === false && partner.incubationTime <= 0) {
      if (Math.random() < infectionRate) {
        partner.incubationTime = incubationperiod;
      } else if (partner.infected === true && person.infected === false && person.incubationTime <= 0) {
        if (Math.random() < infectionRate) {
          person.incubationTime = incubationperiod;
        }
      }
    }
  }
}
function NewRound() {
  roundCount++;
  let infectedThisRound = 0;
  spreadInfection();
  for (let person of population) {
    if (person.incubationTime > 0) {
      person.incubationTime--;
      if (person.incubationTime <= 0) {
        person.infected = true;
      }
    } else if (person.infected) {
      infectedThisRound++;
    }
  }
}

function generatePopulation(size) {
  population = [];
  roundCount = 0;
  for (let i = 0; i < size; i++) {
    population.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      infected: false,
      incubationTime: 0,
    });
  }
  population[0].infected = false; // start with one incubated person (help from AI)
  population[0].incubationTime = incubationperiod;
}

/* --- CONTROLS --------------------------------------------------------- */

let topBar = gi.addTopBar();

topBar.addButton({
  text: "Next Round",
  onclick: function () {
    NewRound();
  },
});

topBar.addSlider({
  label: "Infection Rate",
  min: 0,
  max: 1,
  step: 0.01,
  value: infectionRate,
  oninput: function (value) {
    infectionRate = value;
  },
});
topBar.addSlider({
  label: "Incubation period",
  min: 1,
  max: 50,
  step: 1,
  value: incubationperiod,
  oninput: function (value) {
    incubationperiod = value;
  },
});

topBar.addSlider({
  label: "Initial Population",
  min: 16,
  max: 2048,
  oninput: function (value) {
    generatePopulation(value);
  },
});

generatePopulation(16); // start with 16 people

topBar.addButton({
  text: "Reset",
  onclick: function () {
    generatePopulation(16);
      roundCount = 0;
  },
});

// TODO: add sliders or inputs for your own parameters here

gi.run();
