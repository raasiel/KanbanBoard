'use strict';

module.exports = function (grunt){

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
            db:"kanbantfs",
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
            var execString = "mongoexport --db " + exportConf.db + " --collection " + entry  +" --out ../db/"+ entry +".json --journal --jsonArray";
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
                db : 'kanbantfs',
                host : 'localhost', //optional
                port: '27017', //optional
                //username : 'username', //optional
                //password : 'password',  //optional
                stopOnError : false,  //optional
                collections : [
                    {
                        name : 'user',
                        type : 'json',
                        file : '../db/user.json',
                        jsonArray : true,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'project',
                        type : 'json',
                        file : '../db/project.json',
                        jsonArray : true,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'projectstatus',
                        type : 'json',
                        file : '../db/projectstatus.json',
                        jsonArray : true,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    },
                    {
                        name : 'task',
                        type : 'json',
                        file : '../db/task.json',
                        jsonArray : true,  //optional
                        upsert : true,  //optional
                        drop : true  //optional
                    }
                ]
            }
        }
    })

    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['less', 'nodemon']);
    } else {
        grunt.registerTask('default', ['less', 'nodemon']);
    }

}
