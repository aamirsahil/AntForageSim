/******************************************************************************/
/** @class Agent */

function Agent(actions=[0,1,2,3,4], q=null){
  this.hasFood = 0;
  this.foodCount = 0;
  this.pherTime = 0;
  this.ai = new QLearn(qEpsilon, qLambda, qAlpha, q);
  this.ai.setActions(actions);
  this.foodCount_array = [];
  this.action_array = [];
  this.dropper = true;

  /****************************************************************************/
  /** @class Agent @func update */

  this.update = function(time){
    var here = this.getLocation(); // object of Cell
    var reward = negReward;
    if(time%100 == 0){
      this.checkDropper();
    }
    if(this.hasFood){
      if(here.isHome){ this.hasFood = 0; this.turnAround(); this.foodCount++; foodCount[0]++; reward = posReward; this.foodCount_array.push(1); }
      else{ this.foodCount_array.push(0); }
    } else {
      this.foodCount_array.push(0);
      if(here.isFood){ this.hasFood = 1; this.turnAround(); }
    }

    if(this.pherTime < 5){ this.pherTime++; } /** @param */

    var state_arr = [this.hasFood, this.getHomePherLevel(), this.getFoodPherLevel(), this.pherTime];
    var state = '';
    for(var i = 0; i < state_arr.length; i++){ state += state_arr[i]; }

    this.ai.learn(state, reward);

    var choice = this.ai.do(state); // choice of action
    this.action_array.push(choice);
    // if(this.world.age > 100){ count[choice]++; }
    count[choice]++;

    if(choice == 0){ this.dropHomePher(); }
    else if(choice == 1){ this.dropFoodPher(); }
    else if(choice == 2){ this.followHomePher(); }
    else if(choice == 3){ this.followFoodPher(); }
    else if(choice == 4){ this.moveRandomly(); }
  }

  /****************************************************************************/
  /** @class Agent @func dropFoodPher */

  this.dropFoodPher = function(){
    var here = this.getLocation();
    here.foodPher += 0.2; /** @param */
    here.foodPher_dropCount++;
    this.pherTime = 0;
  }

  /****************************************************************************/
  /** @class Agent @func dropHomePher */

  this.dropHomePher = function(){
    var here = this.getLocation();
    here.homePher += 0.2; /** @param */
    here.homePher_dropCount++;
    this.pherTime = 0;
  }

  /****************************************************************************/
  /** @class Agent @func getPherLevel */

  this.getPherLevel = function(p){
    if(p == 0){ return 0 }
    if(p < 0.1){ return 1 }
    if(p < 0.25){ return 2 }
    return 3
  }

  /****************************************************************************/
  /** @class Agent @func getFoodPherLevel */

  this.getFoodPherLevel = function(){
    return this.getPherLevel( this.getLocation().foodPher )
  }

  /****************************************************************************/
  /** @class Agent @func getHomePherLevel */

  this.getHomePherLevel = function(){
    return this.getPherLevel( this.getLocation().homePher )
  }

  /****************************************************************************/
  /** @class Agent @func followFoodPher */

  this.followFoodPher = function(){
    var c = this.getCellAhead();
    this.turn(-1);
    var l = this.getCellAhead();
    this.turn(2);
    var r = this.getCellAhead();
    this.turn(-1);

    if(c.isFood){ c = 1; } else { c = c.foodPher }
    if(l.isFood){ l = 1; } else { l = l.foodPher }
    if(r.isFood){ r = 1; } else { r = r.foodPher }
    this.followPher(l,c,r);
  }

  /****************************************************************************/
  /** @class Agent @func followHomePher */

  this.followHomePher = function(){
    var c = this.getCellAhead();
    this.turn(-1);
    var l = this.getCellAhead();
    this.turn(2);
    var r = this.getCellAhead();
    this.turn(-1);

    if(c.isHome){ c = 1; } else { c = c.homePher }
    if(l.isHome){ l = 1; } else { l = l.homePher }
    if(r.isHome){ r = 1; } else { r = r.homePher }
    this.followPher(l,c,r);
  }

  /****************************************************************************/
  /** @class Agent @func followPher */

  this.followPher = function(l,c,r){
    if(l == c && c == r){
      var temp_rand = Math.random();
      if(temp_rand < 0.3333){ this.turnLeft(); }
      else if(temp_rand < 0.6666){ this.turnRight(); }
      else { this.goForward(); }
      return
    }

    var m = d3.max([l,c,r]);
    if(m == c){}
    else if(m == l){ this.turnLeft(); }
    else{ this.turnRight(); }
    this.goForward();
  }

  /****************************************************************************/
  /** @class Agent @func moveRandomly */

  this.moveRandomly = function(){
    this.turn( [0,1,-1].random() );
    this.goForward();
  }

  /****************************************************************************/
  /** @class Agent @func turn */

  this.turn = function(amount){
    this.dir = (this.dir+amount)%this.world.directions.length;
    if(this.dir < 0){ this.dir += this.world.directions.length; }
  }

  /****************************************************************************/
  /** @class Agent @func turnLeft */

  this.turnLeft = function(){
    this.turn(-1);
  }

  /****************************************************************************/
  /** @class Agent @func turnRight */

  this.turnRight = function(){
    this.turn(1);
  }

  /****************************************************************************/
  /** @class Agent @func turnAround */

  this.turnAround = function(){
    this.turn( 0.5*this.world.directions.length );
  }

  /****************************************************************************/
  /** @class Agent @func goForward */

  this.goForward = function(){
    var dx = this.world.directions[this.dir][0];
    var dy = this.world.directions[this.dir][1];
    this.x = (this.x+dx)%this.world.width; if(this.x < 0){ this.x += this.world.width; }
    this.y = (this.y+dy)%this.world.height; if(this.y < 0){ this.y += this.world.height; }
  }

  /****************************************************************************/
  /** @class Agent @func goBackward */

  this.goBackward = function(){
    this.turnAround(); this.goForward(); this.turnAround();
  }

  /****************************************************************************/
  /** @class Agent @func getLocation */

  this.getLocation = function(){
    return this.world.grid[this.y][this.x]
  }

  /****************************************************************************/
  /** @class Agent @func seesAgentAhead */

  // this.seesAgentAhead = function(){
  //   var x = this.x, y = this.y;
  //   this.goForward();
  //   var x2 = this.x, y2 = this.y;
  //   this.x = x; this.y = y;
  //   return this.world.isAgentAt(x2, y2);
  // }

  /****************************************************************************/
  /** @class Agent @func getCellAhead */

  this.getCellAhead = function(){
    var x = this.x, y = this.y;
    this.goForward();
    var cell = this.getLocation();
    this.x = x; this.y = y;
    return cell
  }

  /****************************************************************************/
  /** @class Agent @func checkDropper */

  this.checkDropper = function(){
    let len = this.action_array.length;
    let lastActions = this.action_array.slice(len-100, len)
    if(lastActions.includes(0) || lastActions.includes(1)){
      this.dropper = true;
    }
    else{
      this.dropper = false;
    }
  }

  /****************************************************************************/
  /** @class Agent @func getNearbyLocations */

  // this.getNearbyLocations = function(){
  //   dirs = this.world.directions;
  //   return dirs.map(d => { return this.world.getCell(this.x, this.y, d) });
  // }

}
