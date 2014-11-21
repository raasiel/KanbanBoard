KanbanBoard
===========

A web based kanban board that also supports tasks from TFS. Uses MongoDB as database.

How to setup
------------
1. Make sure you have nodejs installed.
2. Make sure mongodb is installed and running.
3. Download source from 
    git clone https://github.com/raasiel/KanbanBoard/
4. Need to install dependencies. Need to run as root, since mongo connector compiles on install.
    sudo npm install
5. Run grunt to create a database in mongo and add test data
    grunt mongo-import
6. Run the app
    grunt 
