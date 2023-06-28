/******************************************************************************/
/** Misc */

Array.prototype.random = function(){
    return this[Math.floor(Math.random()*this.length)]
  }
  
  Array.prototype.indicesOf = function(d){
    var temp = [];
    for(var i = 0; i < this.length; i++){ if(this[i] == d){ temp.push(i); } }
    return temp
  }
  
  /******************************************************************************/
  /** @func setup */
  
  var simulation = null;
  var timer_count = 0;
  
  var stop = false;
  var simulationRunning = false;
  
  var currentDefaultValues = {
    antCount: 10,
    evaporationRate: 0.01,
    dispersionRate: 0.04,
    action1: true,
    action2: true,
    action3: true,
    action4: true,
    action5: true,

    perturb1: {val: false, Num: 10, Type: "Dropper", Time: 1000},
    perturb2: {val: false, Num: 10, Type: "Dropper", Time: 1000},
    perturb3: {val: false, Num: 10, Type: "Dropper with free", Time: 1000},
    perturb4: {val: false, Time: 1000},
    perturb5: false 
  }
  
  var bin_length = 100;
  
  /******************************************************************************/
  /** @func setup */
  
  function setup(){
  
    // Create Canvas
    canvas = new Canvas();
  
    createEvents();
    createDefaultValues();
  
    reset();
  }
  
  /******************************************************************************/
  /** @func reset */
  
  function reset(){
    // Create Simulation
    simulation = new Simulation();
    applyDefaultValues();
  
    timer_count = 0;
    stop = true;
    simulationRunning = false;
  
    // Assign Global variables
    qEpsilon = simulation.qEpsilon;
    qAlpha = simulation.qAlpha;
    qLambda = simulation.qLambda;
  
    dispersionRate = simulation.dispersionRate;
    evaporationRate = simulation.evaporationRate;
  
    negReward = simulation.negReward;
    posReward = simulation.posReward;
  
    count = simulation.count;   // This will link the two arrays
    foodCount = simulation.foodCount;   // This will link the two arrays
    foodCount_array = simulation.foodCount_array;   // This will link the two arrays
  
    // Calling setup
    simulation.setup();
  
    // Create Canvas
    canvas.setup({ div: 'size-div', background: 'background_layer', foreground: 'foreground_layer', width: simulation.width, height: simulation.height });
    canvas.update(simulation.world);
  
    DOM.setup();
    DOM.update(simulation);
  }
  
  /******************************************************************************/
  /** @func update */
  
  function update(){
    simulation.update();
  
    canvas.update(simulation.world);
    if(timer_count % bin_length == 0){ DOM.update(simulation); }
  
    timer_count++;
    if(timer_count % 100 == 0){ qEpsilon *= 0.99; } // Reducing exploration in qLearning over time
  
    if(stop){ simulationRunning = false; return }
  
    window.requestAnimationFrame(update);
  }
  
  /******************************************************************************/
  /** @func createEvents */
  
  function createEvents(){
    d3.select('#play-pause').on('click', function(){
      if(simulationRunning){ stop = true; d3.select(this).html('Play'); }
      else { stop = false; simulationRunning = true; d3.select(this).html('Pause'); update(); }
    })
  
    d3.select('#reset').on('click', function(){
      d3.select('#play-pause').html('Play');
      simulationRunning = false; stop = true;
      setTimeout(function(){ reset(); }, 40);
    })
  
    d3.select('#ant_count_slider').on('input', function(){
      d3.select('#ant_count_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#dispersion_rate_slider').on('input', function(){
      d3.select('#dispersion_rate_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#evaporation_rate_slider').on('input', function(){
      d3.select('#evaporation_rate_slider_text').html( d3.select(this).property('value') );
    })
  
    // perturbations
    d3.select('#perturb1Num').on('input', function(){
      d3.select('#perturb1Num_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#perturb1Time').on('input', function(){
      d3.select('#perturb1Time_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#perturb2Num').on('input', function(){
      d3.select('#perturb2Num_slider_text').html( d3.select(this).property('value') );
    })
    d3.select('#perturb2Time').on('input', function(){
      d3.select('#perturb2Time_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#perturb3Num').on('input', function(){
      d3.select('#perturb3Num_slider_text').html( d3.select(this).property('value') );
    })
  
    d3.select('#perturb3Time').on('input', function(){
      d3.select('#perturb3Time_slider_text').html( d3.select(this).property('value') );
    })

    d3.select('#perturb4Time').on('input', function(){
      d3.select('#perturb4Time_slider_text').html( d3.select(this).property('value') );
    })
    // perturbations
    d3.select('#setup').on('click', function(){
      d3.select('#play-pause').html('Play');
      simulationRunning = false; stop = true;
      setTimeout(function(){ updateDefaultValues(); reset(); }, 40);
    })
  }
  
  /******************************************************************************/
  /** @func createDefaultValues */
  
  function createDefaultValues(){
    d3.select('#ant_count_slider').property('value', currentDefaultValues.antCount);
    d3.select('#ant_count_slider_text').html(currentDefaultValues.antCount);
  
    d3.select('#dispersion_rate_slider').property('value', currentDefaultValues.dispersionRate);
    d3.select('#dispersion_rate_slider_text').html(currentDefaultValues.dispersionRate);
  
    d3.select('#evaporation_rate_slider').property('value', currentDefaultValues.evaporationRate);
    d3.select('#evaporation_rate_slider_text').html(currentDefaultValues.evaporationRate);
  
    d3.select('#action1-checkbox').property('checked', currentDefaultValues.action1);
    d3.select('#action2-checkbox').property('checked', currentDefaultValues.action2);
    d3.select('#action3-checkbox').property('checked', currentDefaultValues.action3);
    d3.select('#action4-checkbox').property('checked', currentDefaultValues.action4);
    d3.select('#action5-checkbox').property('checked', currentDefaultValues.action5);

    // perturbation
    d3.select('#perturb1-checkbox').property('checked', currentDefaultValues.perturb1.val);
    d3.select('#perturb1Num').property('value', currentDefaultValues.perturb1.Num);
    d3.select('#perturb1Num_slider_text').html(currentDefaultValues.perturb1.Num);
    d3.select('#perturb1Type').property('value', currentDefaultValues.perturb1.Type);
    d3.select('#perturb1Time').property('value', currentDefaultValues.perturb1.Time);
    d3.select('#perturb1Time_slider_text').html(currentDefaultValues.perturb1.Time);

    d3.select('#perturb2-checkbox').property('checked', currentDefaultValues.perturb2.val);
    d3.select('#perturb2Num').property('value', currentDefaultValues.perturb2.Num);
    d3.select('#perturb2Num_slider_text').html(currentDefaultValues.perturb2.Num);
    d3.select('#perturb2Type').property('value', currentDefaultValues.perturb2.Type);
    d3.select('#perturb2Time').property('value', currentDefaultValues.perturb2.Time);
    d3.select('#perturb2Time_slider_text').html(currentDefaultValues.perturb2.Time);

    d3.select('#perturb3-checkbox').property('checked', currentDefaultValues.perturb3.val);
    d3.select('#perturb3Num').property('value', currentDefaultValues.perturb3.Num);
    d3.select('#perturb3Num_slider_text').html(currentDefaultValues.perturb3.Num);
    d3.select('#perturb3Type').property('value', currentDefaultValues.perturb3.Type);
    d3.select('#perturb3Time').property('value', currentDefaultValues.perturb3.Time);
    d3.select('#perturb3Time_slider_text').html(currentDefaultValues.perturb3.Time);

    d3.select('#perturb4-checkbox').property('checked', currentDefaultValues.perturb4.val);
    d3.select('#perturb4Time').property('value', currentDefaultValues.perturb4.Time);
    d3.select('#perturb4Time_slider_text').html(currentDefaultValues.perturb4.Time);

    d3.select('#perturb5-checkbox').property('checked', currentDefaultValues.perturb5);
  }
  
  /******************************************************************************/
  /** @func updateDefaultValues */
  
  function updateDefaultValues(){
    currentDefaultValues.antCount = d3.select('#ant_count_slider').property('value');
    currentDefaultValues.dispersionRate = d3.select('#dispersion_rate_slider').property('value');
    currentDefaultValues.evaporationRate = d3.select('#evaporation_rate_slider').property('value');
  
    currentDefaultValues.action1 = d3.select('#action1-checkbox').property('checked');
    currentDefaultValues.action2 = d3.select('#action2-checkbox').property('checked');
    currentDefaultValues.action3 = d3.select('#action3-checkbox').property('checked');
    currentDefaultValues.action4 = d3.select('#action4-checkbox').property('checked');
    currentDefaultValues.action5 = d3.select('#action5-checkbox').property('checked');
// Perturbations
    currentDefaultValues.perturb1.val = d3.select('#perturb1-checkbox').property('checked');
    currentDefaultValues.perturb1.Num = d3.select('#perturb1Num').property('value');
    currentDefaultValues.perturb1.Type = d3.select('#perturb1Type').property('value');
    currentDefaultValues.perturb1.Time = d3.select('#perturb1Time').property('value');

    currentDefaultValues.perturb2.val = d3.select('#perturb2-checkbox').property('checked');
    currentDefaultValues.perturb2.Num = d3.select('#perturb2Num').property('value');
    currentDefaultValues.perturb2.Type = d3.select('#perturb2Type').property('value');
    currentDefaultValues.perturb2.Time = d3.select('#perturb2Time').property('value');

    currentDefaultValues.perturb3.val = d3.select('#perturb3-checkbox').property('checked');
    currentDefaultValues.perturb3.Num = d3.select('#perturb3Num').property('value');
    currentDefaultValues.perturb3.Type = d3.select('#perturb3Type').property('value');
    currentDefaultValues.perturb3.Time = d3.select('#perturb3Time').property('value');

    currentDefaultValues.perturb4.val = d3.select('#perturb4-checkbox').property('checked');
    currentDefaultValues.perturb4.Time = d3.select('#perturb4Time').property('value');

    currentDefaultValues.perturb5 = d3.select('#perturb5-checkbox').property('checked');
  }
  
  /******************************************************************************/
  /** @func applyDefaultValues */
  
  function applyDefaultValues(){
    simulation.antCount = currentDefaultValues.antCount;
    simulation.dispersionRate = currentDefaultValues.dispersionRate;
    simulation.evaporationRate = 1 - currentDefaultValues.evaporationRate;
  
    simulation.actions = [];
    if( currentDefaultValues.action1 ){ simulation.actions.push(0); }
    if( currentDefaultValues.action2 ){ simulation.actions.push(1); }
    if( currentDefaultValues.action3 ){ simulation.actions.push(2); }
    if( currentDefaultValues.action4 ){ simulation.actions.push(3); }
    if( currentDefaultValues.action5 ){ simulation.actions.push(4); }

    // perturbations
    per = currentDefaultValues.perturb1
    simulation.perturbation1 = {val: per.val, Num: per.Num, Time: per.Time, Type: per.Type};
    per = currentDefaultValues.perturb2
    simulation.perturbation2 = {val: per.val, Num: per.Num, Time: per.Time, Type: per.Type};
    per = currentDefaultValues.perturb3
    simulation.perturbation3 = {val: per.val, Num: per.Num, Time: per.Time, Type: per.Type};
    per = currentDefaultValues.perturb4
    simulation.perturbation4 = {val: per.val, Time: per.Time};
    simulation.perturbation5 = currentDefaultValues.perturb5;
  }
  
  /******************************************************************************/
  /** @func document.ready */
  
  $(document).ready(function(){
    setup();
  })
  