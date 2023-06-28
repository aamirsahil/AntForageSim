/******************************************************************************/
/** @class Cell */

function Cell(){
    this.isHome = 0;
    this.isFood = 0;
    this.homePher = 0;
    this.foodPher = 0;
  
    this.homePher_dropCount = 0;
    this.foodPher_dropCount = 0;
  
    /****************************************************************************/
    /** @class Cell @func update */
  
    this.update = function(around){
      var htotal = 0, ftotal = 0;
      around.forEach(c => { htotal += c.homePher; ftotal += c.foodPher; })
      var havg = htotal/around.length;
      var favg = ftotal/around.length;
  
      this.homePher += (havg-this.homePher)*dispersionRate;
      this.homePher *= evaporationRate;
      if(this.homePher > 1){ this.homePher = 1; }
      if(this.homePher < 0.001){ this.homePher = 0; }
  
      this.foodPher += (havg-this.foodPher)*dispersionRate;
      this.foodPher *= evaporationRate;
      if(this.foodPher > 1){ this.foodPher = 1; }
      if(this.foodPher < 0.001){ this.foodPher = 0; }
    }
  
    /****************************************************************************/
    /** @class Cell @func copy */
  
    this.copy = function(other){
      this.isHome = other.isHome;
      this.isFood = other.isFood;
      this.homePher = other.homePher;
      this.foodPher = other.foodPher;
      this.homePher_dropCount = other.homePher_dropCount;
      this.foodPher_dropCount = other.foodPher_dropCount;
    }
  
    /****************************************************************************/
    /** @class Cell @func load */
  
    this.load = function(text){
      this.isHome = 0;
      this.isFood = 0;
      if(text == 'H'){ this.isHome = 1; }
      if(text == 'F'){ this.isFood = 1; }
    }
  }
  