/******************************************************************************/
/** @class Canvas */

function Canvas(){
    this.rect_array_1 = [];
    this.rect_array_2 = [];
  
  //   this.box_size = 15;
    this.showAgents = true;
  
    /******************************************************************************/
    /** @class Canvas @func setup */
  
    this.setup = function(params){
  
      this.width = params.width;
      this.height = params.height;
  
      var div_width = parseFloat(d3.select('#'+params.div).style('width'));
      this.box_size = 0.95*div_width/this.width;
  
      this.svg_width = this.box_size*this.width;
      this.svg_height = this.box_size*this.height;
  
      this.background = d3.select('#'+params.background);
      this.background.selectAll('rect').remove();
      this.background.attrs({ width: this.svg_width, height: this.svg_height }).styles({ 'background': 'black' });
  
      this.foreground = d3.select('#'+params.foreground);
      this.foreground.selectAll('rect').remove();
      this.foreground.attrs({ width: this.svg_width, height: this.svg_height });
  
      var box_size = this.box_size;
      for(var y = 0; y < this.height; y++){
        this.rect_array_1[y] = [];
        this.rect_array_2[y] = [];
        for(var x = 0; x < this.width; x++){
          this.rect_array_1[y][x] = this.background.append('rect').attrs({ x: x*box_size, y: y*box_size, width: box_size, height: box_size });
          this.rect_array_2[y][x] = this.foreground.append('rect').attrs({ x: x*box_size, y: y*box_size, width: box_size, height: box_size });
        }
      }
  
      this.reset();
    }
  
    /******************************************************************************/
    /** @class Canvas @func reset */
  
    this.reset = function(){
      for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
          this.rect_array_1[y][x].styles({ fill: 'black', stroke: 'none', 'opacity': 1 });
          this.rect_array_2[y][x].styles({ fill: 'none', stroke: 'none' });
        }
      }
    }
  
    /******************************************************************************/
    /** @class Canvas @func update */
  
    this.update = function(world){
      // Clearing off Layer 2
      for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
          this.rect_array_2[y][x].styles({ fill: 'none', stroke: 'none' });
        }
      }

      // Displaying cell pheromone levels
      for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
          var cell = world.grid[y][x];
          var colour = d3.rgb(255*cell.homePher, 0, 255*cell.foodPher);
          this.rect_array_1[y][x].styles({ fill: colour });
        }
      }
      // Dispalying home and food
      for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
          var cell = world.grid[y][x];
          if(cell.isHome){ this.rect_array_2[y][x].styles({ fill: '#FF0000', stroke: '#FF0000' }); }
          if(cell.isFood){ this.rect_array_2[y][x].styles({ fill: '#0000FF', stroke: '#0000FF' }); }
        }
      }
      // Dispalying agents
      for(var i = 0; i < world.agents.length; i++){
        var agent = world.agents[i];
        var color = agent.dropper ? '#00F407' : "#7CFFFA";
        console.log(color);
        this.rect_array_2[agent.y][agent.x].styles({ stroke: color, fill: color });
      }
      if(world.time == 0) print();
      if(world.time == 1000) print();
      if(world.time == 70000) print();
    }
    
  }
  