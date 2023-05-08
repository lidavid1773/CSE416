import jsTPS_Transaction from "./jsTPS"

export default class mapEditTransaction extends jsTPS_Transaction {
    constructor(oldValue, newValue) {
      super();
      this.newValue = newValue;
      this.oldValue = oldValue;
    }
  
    doTransaction() {
        //console.log(this.newValue);
    }
  
    undoTransaction() {
      //console.log(this.oldValue);
      return this.oldValue;
    }
  }