'use strict';

module.exports = function (grunt){

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask ("default", function(){
        console.log ("Starting Kanban TFS automation")
    })

    grunt.initConfig({
        less: {
            development: {
                options: {
                    //paths: ["public/stylesheets"],
                    compress:false
                },
                files: {
                    "public/stylesheets/style.css": "public/stylesheets/style.less",
                    "public/stylesheets/metro-ui-light.css": "public/stylesheets/metro-ui-light.less"
                }
            }
        }
    })
}
