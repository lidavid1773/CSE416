const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema(
    {    
        counter:{type: Number, required: true},
    }
)

module.exports = mongoose.model('Counter', CounterSchema);