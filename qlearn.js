/******************************************************************************/
/** @class QLearn */

function QLearn(epsilon=0.1,alpha=0.2,lambd=0.5, q=null){
    this.historyA = [];
    this.historyS = [];
    if(q==null)
      this.q = {};    // QLearn.masterQ
    else
      this.q = q
    this.oldstate = null;
    this.actions = null;
  
    this.epsilon = epsilon;
    this.alpha = alpha;
    this.lambd = lambd;
  
    /****************************************************************************/
    /** @class QLearn @func setActions */
  
    this.setActions = function(actions){
      this.actions = actions;
    }
  
    /****************************************************************************/
    /** @class QLearn @func getQ */
  
    this.getQ = function(state, action){
      var key = state + action;
      if(this.q[key] == undefined){ return 0 }
      return this.q[key]
    }
  
    /****************************************************************************/
    /** @class QLearn @func setQ */
  
    this.setQ = function(state, action, value){
      var key = state + action;
      this.q[key] = value;
    }
  
    /****************************************************************************/
    /** @class QLearn @func do */
  
    this.do = function(state){
      var action = null;
      this.oldstate = state;
  
      if(Math.random() < qEpsilon){ // Changed to using gloabl qEpsilon
        action = this.actions.random();
      } else {
        var q_arr = this.actions.map(a => { return this.getQ(state, a) });
        var q_max = d3.max(q_arr);
        var i_arr = q_arr.indicesOf(q_max);
        var index = i_arr.random();
        action = this.actions[index];
      }
  
      this.oldaction = action;
      this.historyA.push(action); // Can be removed to improve speed
      this.historyS.push(state);  // Can be removed to improve speed
      return action
    }
  
    /****************************************************************************/
    /** @class QLearn @func learn */
  
    this.learn = function(newstate, reward){
      if(this.oldstate == null){ return }
  
      var oldq = this.getQ(this.oldstate, this.oldaction);
      var maxqnew = d3.max( this.actions.map(a => { return this.getQ(newstate, a) }) );
      var newq = oldq + qAlpha*(reward + qLambda*maxqnew - oldq);
      this.setQ(this.oldstate, this.oldaction, newq);
    }
  
  }
  