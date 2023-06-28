/******************************************************************************/
/** @class World */

function World(Cell,width,height,directions=8,calcAround=1,cellUpdate=1){
    var directions8 = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1, 0], [-1,-1]];
    var directions4 = [[0,-1], [1,0], [0,1],[-1, 0]];
  
    if(directions == 8){ this.directions = directions8; }
    else if(directions == 4){ this.directions = directions4; }
    else{ alert('Unknown number of directions'); }
  
    this.calcAround = calcAround;
    this.cellUpdate = cellUpdate;
  
    this.Cell = Cell;
    this.width = width;
    this.height = height;
  
    this.grid = d3.range(height).map(i => {
      return( d3.range(width).map(j => { return( new Cell() ) }) )
    })
  
    this.grid2 = d3.range(height).map(i => {
      return( d3.range(width).map(j => { return( new Cell() ) }) )
    })
  
    this.agents = [];
    this.age = 0;
    this.time = 0;
    this.dropperArray = [];
    this.freeArray = [];
  
    /****************************************************************************/
    /** @class World @func getCell */
  
    this.getCell = function(sx,sy,dir){
      dx = dir[0]; dy = dir[1];
      x = (sx+dx)%this.width; if(x < 0){ x += this.width; }
      y = (sy+dy)%this.height; if(y < 0){ y += this.height; }
      return this.grid[y][x]
    }
  
    /****************************************************************************/
    /** @class World @func update */
  
    this.update = function(pertubation){
      this.age++;
      this.time++;
      //////////////////////////////////////////////////////////////////////
    //   perturbations
    // death
    if(pertubation.p1.val){
      if(this.time == pertubation.p1.Time){
        this.removeAgents(pertubation.p1.Num, pertubation.p1.Type)
      }
    }
    // birth
    if(pertubation.p2.val){
      if(this.time == pertubation.p2.Time){
        this.insertAgents(pertubation.p2.Num, pertubation.p2.Type)
      }
    }
    // seq to rand
    // if(this.time==time){
        // set randomize to true
        // randomize at t=0 make it random
    // }
    // 
    /////////////////////////////////////////////////////////////////////////
      // Update Cells
      if(this.cellUpdate){
        for(var x = 0; x < this.width; x++){
          for(var y = 0; y < this.height; y++){
            var c = this.grid2[y][x];
            c.copy(this.grid[y][x]);
            if(this.calcAround){
              var around = this.directions.map(d => { return this.getCell(x,y,d) });
              c.update(around);
            } else { c.update(null); }
          }
        }
  
        for(var x = 0; x < this.width; x++){
          for(var y = 0; y < this.height; y++){
            this.grid[y][x].copy(this.grid2[y][x]);
          }
        }
      }
  
      // Update Agents
      if(pertubation.p5){
        // shuffle agent list
        this.agents.sort(() => Math.random() - 0.5)
        console.log("Hwy");
      }
      for(var i = 0; i < this.agents.length; i++){
        var a = this.agents[i]
        a.update(this.time);
      }
    }
        
    /****************************************************************************/
    /** @class World @func removeAgents */
  
    this.removeAgents = function(num, type){
      if(type=="Dropper"){
        this.findDropperArray();
        if(this.dropperArray.length < num)
          num = this.dropperArray.length;
        let newAgensts = [];
        for(let i=0; i<this.agents.length; i++){
          if(!this.dropperArray.includes(i) && newAgensts.length<(this.agents.length-num))
            newAgensts.push(this.agents[i]);
        }
        this.agents = newAgensts;
      }
      if(type=="Free"){
        this.findFreeArray();
        if(this.freeArray.length < num)
          num = this.freeArray.length;
        let newAgensts = [];
        for(let i=0; i<this.agents.length; i++){
          if(!this.freeArray.includes(i) && newAgensts.length<(this.agents.length-num))
            newAgensts.push(this.agents[i]);
        }
        this.agents = newAgensts;
      }
    }
      /****************************************************************************/
    /** @class World @func insertAgents */
  
    this.insertAgents = function(num, type){
      // Log home positions
      let homes = []
      for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
          if(this.grid[y][x].isHome){ homes.push({ x: x, y: y }); }
          }
      }
      if(type=="Dropper"){
        this.findDropperArray();
        if(this.dropperArray.length == 0)
          return;
        for(let i=0; i<num; i++){
          let index = Math.floor(Math.random() * this.dropperArray.length);
          index = this.dropperArray[index];
          console.log(index);
          let Q = this.agents[index].ai.q;
          let ant = new Agent(this.actions, Q);
          let rand_index = Math.floor(Math.random()*homes.length);
          let x = homes[rand_index].x;
          let y = homes[rand_index].y;
          this.addAgent(ant,x,y);  
        }
      }
      if(type=="Free"){
        this.findFreeArray();
        if(this.freeArray.length < num)
          num = this.freeArray.length;
        let newAgensts = [];
        for(let i=0; i<this.agents.length; i++){
          if(!this.freeArray.includes(i) && newAgensts.length<(this.agents.length-num))
            newAgensts.push(this.agents[i]);
        }
        this.agents = newAgensts;
      }
    }
    /****************************************************************************/
    /** @class World @func dropperList */
  
    this.findDropperArray = function(){
      let len = this.agents.length;
      this.dropperArray = [];
      for(let i=0; i<len; i++){
        if(this.agents[i].dropper)
          this.dropperArray.push(i);
      }
    }
    /****************************************************************************/
    /** @class World @func freeList */
  
    this.findFreeArray = function(){
      let len = this.agents.length;
      this.freeArray = [];
      for(let i=0; i<len; i++){
        if(!this.agents[i].dropper)
          this.freeArray.push(i);
      }
    }

    /****************************************************************************/
    /** @class World @func load */
  
    this.load = function(file){
      lines = file;
      var fh = lines.length;
      var fw = d3.max( lines.map(d => { return d.length }) );
  
      var startx, starty;
      if(fh > this.height){ fh = this.height; starty = 0; }
      else{ starty = parseInt(0.5*(this.height-fh)); }
  
      if(fw > this.width){ fw = this.width; startx = 0; }
      else{ startx = parseInt(0.5*(this.width-fw)); }
  
      // Define the grid
      for(var y = 0; y < fh; y++){
        var line = lines[y];
        var width = d3.min([fw, line.length]);
        for(var x = 0; x < width; x++){
          this.grid[starty+y][startx+x].load(line[x]);
        }
      }
  
      this.age = 0;
    }
  
    /****************************************************************************/
    /** @class World @func addAgent */
  
    this.addAgent = function(agent, x=null, y=null, dir=null){
      if(x == null){ x = Math.floor( Math.random()*this.width ); }
      if(y == null){ y = Math.floor( Math.random()*this.height ); }
      if(dir == null){ dir = Math.floor( Math.random()*this.directions.length ); }
  
      agent.x = x; agent.y = y; agent.dir = dir; agent.world = this;
      this.agents.push(agent);
    }
  
    /****************************************************************************/
    /** @class World @func removeAgent */
  
    // this.removeAgent = function(index){
    //   this.agents.remove(index);
    // }
  
    /****************************************************************************/
    /** @class World @func countChanges */
  
    // this.countChanges = function(){
    //   var count = 0;
    //   for(var x = 0; x < this.width; x++){
    //     for(var y = 0; y < this.height; y++){
    //       if(this.grid[y][x].colour() != this.grid2[y][x].colour()){ count++; }
    //       return parseFloat(count)/(this.width*this.length);
    //     }
    //   }
    // }
  
    /****************************************************************************/
    /** @class World @func isAgentAt */
  
    // this.isAgentAt = function(x,y){
    //   this.agents.forEach(a => {
    //     if(a.x == x && a,y == y){ return 1 }
    //   })
    //   return 0
    // }
  
  }
  