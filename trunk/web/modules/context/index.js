/**
 * Created by shafqat on 9/12/14.
 */

function ApplicationContext (app, config) {
    this.app = app;
    this.config = config;
    app.context = this;
    return this;
};


ApplicationContext.prototype = {
}

module.exports = ApplicationContext;