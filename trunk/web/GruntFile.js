'use strict';

module.exports = function (grunt){

    var config = require ("./config.active.js");

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-mongoimport');
    grunt.loadNpmTasks('grunt-nodemon');

    /*
    grunt.registerTask ("default", function(){
        console.log ("Starting KanbanBoard application")

    })*/


    grunt.registerTask ("mongo-export", function(){

        var sys = require('sys')
        var exec = require('child_process').exec;
        var child;

        var exportConf = {
            db:config.db,
            collections : ['user','project','projectstatus','task'],
            user:null,
            pass:null,
            host:null
        }

        function puts(error, stdout, stderr)
        {
            console.log("Task execution complete")
        }

        exportConf.collections.forEach (function(entry){
            var execString = "mongoexport --db " + exportConf.db + " --collection " + entry  +" --out ../db/"+ entry +".json --journal";
            exec(execString, puts);
        })
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
        },
        nodemon: {
            dev: {
                script: 'start/www.js',
                options: {
                    args: [],
                    ignore: ['node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        mongoimport: {
            options: {
                db : config.db,
                host : config.dbhost, //optional
                port: config.dbport, //optional
                //username : 'username', //optional
                //password : 'password',  //optional
                stopOnError : false,  //optional
                collections : [
                    {
                        name : 'user',
                        type : 'json',
                        file : '../db/user.json',
                        jsonArray : false,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'project',
                        type : 'json',
                        file : '../db/project.json',
                        jsonArray : false,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'projectstatus',
                        type : 'json',
                        file : '../db/projectstatus.json',
                        jsonArray : false,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'task',
                        type : 'json',
                        file : '../db/task.json',
                        jsonArray : false,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    }
                ]
            }
        }
    })

    if (process.env.NODE_ENV === 'production') {
        console.log("production")
        grunt.registerTask('default', ['less', 'nodemon']);

    } else {
        console.log("development")
        grunt.registerTask('default', ['less', 'nodemon']);
    }

}
