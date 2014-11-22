/**
 * Created by shafqat on 9/12/14.
 */

function Logging (context) {
    this.context = context;
    this.winston = require('winston');
    return this;
};

Logging.prototype = {

    context: this.context,
    info : function (message){
        this.winston.info (message)
    },

    warn : function (message){
        this.winston.warn (message)
    },

    error : function (message){
        this.winston.error (message)
    },

    debug: function (message){
        this.winston.debuf (message)
    },

    verbose: function (message){
        this.winston.debuf (message)
    }

}

module.exports = Logging;