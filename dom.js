var DOM = {};
var actions_names = ['Drop Home Pheromone', 'Drop Food Pheromone', 'Follow Home Pheromone', 'Follow Food Pheromone', 'Move Randomly'];

/******************************************************************************/
/** @class DOM @func setup */

DOM.setup = function(){
  var line = { x: [], y: [], mode: 'lines' };
  var data = [line];
  var layout = { xaxis: { title: 'Ticks â†’' }, yaxis: { title: 'Food count per ' +bin_length+ ' time steps â†’' } };
  Plotly.newPlot('graph_div', data, layout, { staticPlot: false });

  var data = d3.range(5).map((i) => {
    var line = { x: [], y: [], mode: 'lines', stackgroup: 'one', name: actions_names[i] };
    return line
  });
  var layout = { xaxis: { title: 'Ticks â†’' }, yaxis: { title: 'Actions per ' +bin_length+ ' time steps â†’' } };
  Plotly.newPlot('graph1_div', data, layout, { staticPlot: false });

  d3.select('#ant_count_text').html(currentDefaultValues.antCount);
  d3.select('#dispersion_rate_text').html(currentDefaultValues.dispersionRate);
  d3.select('#evaporation_rate_text').html(currentDefaultValues.evaporationRate);
  d3.select('#actions_text').html( function(){
    var temp = '';
    if(currentDefaultValues.action1){ temp += 'Drop Home Pheromone, <br> ' };
    if(currentDefaultValues.action2){ temp += 'Drop Food Pheromone,<br> ' };
    if(currentDefaultValues.action3){ temp += 'Follow Home Pheromone,<br> ' };
    if(currentDefaultValues.action4){ temp += 'Follow Food Pheromone,<br> ' };
    if(currentDefaultValues.action5){ temp += 'Move Randomly' };
    return temp
  } )
}

/******************************************************************************/
/** @class DOM @func update */

DOM.update = function(sim){
  d3.select('#food-count').html(sim.foodCount[0]);
  d3.select('#ticks-count').html(timer_count);
  d3.select('#action-1-count').html(sim.count[0]);
  d3.select('#action-2-count').html(sim.count[1]);
  d3.select('#action-3-count').html(sim.count[2]);
  d3.select('#action-4-count').html(sim.count[3]);
  d3.select('#action-5-count').html(sim.count[4]);

  var temp_arr = sim.world.agents.map(agent => { return agent.foodCount_array.splice(0) })
  var sum = 0;
  temp_arr.forEach(d => { sum += d3.sum(d); })
  Plotly.extendTraces('graph_div', { y: [[sum]], x: [[timer_count]] }, [0]);

  var temp_arr = sim.world.agents.map(agent => { return agent.ai.historyA.splice(0) });
  var sum_arr = d3.range(5).map(() => { return 0 });
  temp_arr.forEach(actions => {
    d3.range(5).forEach(d => { sum_arr[d] += actions.indicesOf(d).length; })
  })
  Plotly.extendTraces('graph1_div', { y: [[sum_arr[0]], [sum_arr[1]], [sum_arr[2]], [sum_arr[3]], [sum_arr[4]]], x: [[timer_count], [timer_count], [timer_count], [timer_count], [timer_count]] }, [0,1,2,3,4]);

}
