/******************************************************************************/
/** @class Simulation */

function Simulation(){

    /** @param Simulation */
    this.height=30;
    this.width=30;

    this.antCount=10;
    // this.time_limit=1000;

    this.dispersionRate=0.04;            // rate of spread of pheromone
    this.evaporationRate=0.99;           // rate of disappearance of pheromone

    this.actions=[0,1,2,3,4];            // set to [2,3,4] for no structure generation
    this.posReward=10;			         // reward for completing a trip
    this.negReward=-1;                   // reward for moving

    this.qEpsilon=0.1;			         // Q-Learning exploration rate
    this.qLambda=0.95;			         // Q-Learning future discount rate
    this.qAlpha=0.2;				     // Q-Learning learning rate

    this.count = [0,0,0,0,0];           // How often different actions are chosen
    this.foodCount = [0];         // TO keep track of food collected
    this.foodCount_array = [];

    // pertubation
    this.perturbation1 = {val: false, Num: 0, Time: 1000, Type: "dropper"};
    this.perturbation2 = {val: false, Num: 0, Type: "dropper", Time: 1000};
    this.perturbation3 = {val: false, Num: 0, Type: "dropper with free", Time: 1000};
    this.perturbation4 = {val: false, Time: 1000};
    this.perturbation5 = false;
  }

/******************************************************************************/
/** @class Simulation @function setup */

Simulation.prototype.setup = function(){

    /** @param Simulation */
    this.world = null;
    this.homes = [];

    // Create world
    this.world = new World(Cell, this.width, this.height);
    this.world.load(world_map);

    // Log home positions
    for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
        if(this.world.grid[y][x].isHome){ this.homes.push({ x: x, y: y }); }
        }
    }

    // Add agents
    for(var i = 0; i < this.antCount; i++){
        var ant = new Agent(this.actions);
        var rand_index = Math.floor(Math.random()*this.homes.length);
        var x = this.homes[rand_index].x;
        var y = this.homes[rand_index].y;
        this.world.addAgent(ant,x,y);
    }

}

/******************************************************************************/
/** @class Simulation @function update */

Simulation.prototype.update = function(){
    perturbation = {p1: this.perturbation1, p2: this.perturbation2, p3: this.perturbation3, p4: this.perturbation4, p5: this.perturbation5}
    this.world.update(perturbation);
    // print();
    // this.foodCount_array.push(this.foodCount[0]);
}

/******************************************************************************/
/** @class Simulation @func log_world_foodPher */

Simulation.prototype.log_world_foodPher = function(){
    var str = '';
    for(var y = 0; y < this.height; y++){
      for(var x = 0; x < this.width; x++){
        var d = this.world.grid[y][x].foodPher;
        str += d.toFixed(1) + ' ';
      }
      str += '\n';
    }
    console.log(str);
  }

/******************************************************************************/
/** @class Simulation @func log_world_homePher */

Simulation.prototype.log_world_homePher = function(){
    var str = '';
    for(var y = 0; y < this.height; y++){
      for(var x = 0; x < this.width; x++){
        var d = this.world.grid[y][x].homePher_dropCount;
        str += d.toFixed(0) + ' ';
      }
      str += '\n';
    }
    console.log(str);
  }

/******************************************************************************/
/** @class Simulation @func log_worldscape */

Simulation.prototype.log_worldscape = function(){
    var str = '';
    for(var y = 0; y < this.height; y++){
      for(var x = 0; x < this.width; x++){
        var d = this.world.grid[y][x];
        str += d.isHome ? 'H' : d.isFood ? 'F' : '-';
      }
      str += '\n';
    }
    console.log(str);
  }
