$projectID = "1";

function Sequencer(state) {
    this.myself = this;
    this.state = state;
    this.queue = Array();
}

Sequencer.prototype.queueFunc = function (func, args) {
    var data = { 'func': func, 'args': args, 'sequencer': this, 'state': this.state }
    this.queue.push(data);
}

Sequencer.prototype.execute = function () {
    firstItem = this.queue.shift();
    firstItem.func(this, firstItem.args);
}

Sequencer.prototype.onExecutionComplete = function (self) {
    if (self.queue.length > 0) {
        seqitem = self.queue.shift();
        seqitem.func(self, seqitem.args);
    }
    else {
        // Nice! All functions in the queue has completed.
    }
}

function KanbanBoard() {
}

KanbanBoard.prototype.showBoard = function () {
    
    var seq = new Sequencer($kb);
    seq.queueFunc(this.getProjectStatuses, null);
    seq.queueFunc(this.getProjectUsers, null);
    seq.queueFunc(this.getProjectItems, null);
    

    seq.queueFunc(function (callback, args) {

        board = $("#divBoard");

        boardTable = $("<table id='tblBoard' class='kbBoardTable'></table>");
        board.append(boardTable);

        colors = new ColorWheel();
        thead = $("<thead></thead>");

        boardTable.append(thead);
        tr = $("<tr id='row_master'></tr>");
        //colors.nextColor('bg');
        //tr.append("<td class='" + colors.nextColor('bg') + "-vlight'></td>");
        tr.append("<td class='kbUser'></td>");        
        //console.log(kbSelf);
        for (j = 0; j < kbSelf.projectStatuses.length; j++) {
            projStatus = kbSelf.projectStatuses[j];
            td = $("<th id='cell_master_status_" + projStatus.ProjectStatusID.toString() +
                "' class='" + colors.nextColor('bg') + "-vlight' style='width:150px' >" + projStatus.Name + "</th>")
            tr.append(td);
        }
        thead.append(tr);

        tbody = $("<tbody id='tbBoard'></tbody>");
        
        for (i = 0; i < kbSelf.projectUsers.length; i++) {
            user = kbSelf.projectUsers[i];
            tr = $("<tr id='row_user_" + user.UserID.toString() + "'></tr>");            
            trIndicator = $("<tr id='row_indicator_user_" + user.UserID.toString() + "'></tr>");
            colors.reset();
            //colors.nextColor('bg');

            tr.append("<td id='cell_user_master_" + user.UserID.toString() +
                "' class='kbUser'>" + user.Name + "</td>");
            trIndicator.append("<td id='cell_user_master_" + user.UserID.toString() +
                "' class='kbUser'  ></td>");

            for (j = 0; j < kbSelf.projectStatuses.length; j++) {
                //console.log(kbSelf);
                projStatus = kbSelf.projectStatuses[j];
                td = $("<td id='cell_user_" + user.UserID.toString() +
                    "_status_" + projStatus.ProjectStatusID.toString() +
                    "' ></td>")
                
                colorClass = colors.nextColor('bg');
                td[0].colorClass = colorClass;
                tdIndicator = $("<td id='cell_indicator_user_" + user.UserID.toString() +
                    "_status_" + projStatus.ProjectStatusID.toString() +
                    "' class='" + colorClass + "-vlight kbTaskIndicator'></td>")
                container = new TaskContainer(user, projStatus, td[0]);
                //console.log(kbSelf);

                /*
                divCell = $("<div id='div_user_" + user.UserID.toString() +
                    "_status_" + projStatus.ProjectStatusID.toString() + "' class='listview kbTaskHost' ></div>");                
                divCell[0].status = projStatus; divCell[0].user = user;
                projStatus.taskColorClass = colorClass;                
                td.append(divCell);
                */

                tr.append(td);
                trIndicator.append(tdIndicator);
            }
            tbody.append(trIndicator);
            tbody.append(tr);

        }
        boardTable.append(tbody);

        if (callback != undefined && callback != null) {
            callback.onExecutionComplete(callback);
        }
    });
    
    seq.queueFunc(this.loadProjectItems, null);

    seq.execute();
}

KanbanBoard.prototype.loadProjectItems = function (callback, args) {
    kbSelf = this.state;

    $.each(kbSelf.projectTasks, function (index, item) {
        divHostId = "#div_user_" + item.UserID.toString() + "_status_" + item.StatusID.toString();
        taskContainer = $(divHostId)[0].taskContainer;
        taskContainer.createTask(item);
    });

}

KanbanBoard.prototype.getProjectItems = function (callback, args) {
    kbSelf = this.state;
    $.ajax(
    {
        type: "GET",
        url: "/api/board/get/" + $projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            kbSelf.projectTasks = data;
            if (callback != undefined && callback != null) {
                callback.onExecutionComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}



KanbanBoard.prototype.getProjectStatuses = function (callback, args) {
    kbSelf = this.state;
    $.ajax(
    {
        type: "GET",
        url: "/api/project/statuses/" + $projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            kbSelf.projectStatuses = data;
            if (callback != undefined && callback != null) {
                callback.onExecutionComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}

KanbanBoard.prototype.getProjectUsers = function (callback, args) {
    kbSelf = this.state;
    $.ajax(
    {
        type: "GET",
        url: "/api/project/users/" + $projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            kbSelf.projectUsers = data;
            if (callback != undefined && callback != null) {
                callback.onExecutionComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}

function ColorWheel() {

    colorwheelself = this;
    this.colors = [
        '-color-orange', '-color-yellow',  '-color-greenLight'
        , '-color-green','-color-red'
        ,'-color-blue', '-color-blueLight', '-color-blueDark'
        , '-color-greenDark'
                          
        ,   '-color-pink',          '-color-pinkDark'
        ,'-color-purple',       '-color-darken',        '-color-white'
        , '-color-grayDark', '-color-orangeDark'
    ]

    this.index = 0;

    this.lightColors = [];

    /*
    this.styleKeys = {};
    
    $.each(document.styleSheets[0].cssRules, function (index, rule) {
        try { colorwheelself.styleKeys[rule.selectorText] = rule; } catch (e) { }
    });
    
    console.log(this.styleKeys);
    $.each(this.colors, function (index, name) {
        if (colorwheelself.styleKeys[".bg" +name] != undefined) {
            console.log(colorwheelself.styleKeys[".bg" +name].style.backgroundColor);
        }
    });
    */

    ColorWheel.prototype.nextColor = function (prefix){
        className = prefix + colorwheelself.colors[colorwheelself.index];
        colorwheelself.index++;
        if (colorwheelself.index >= colorwheelself.colors.length) {
            colorwheelself.index = 0;
        }
        return className;
    }

    ColorWheel.prototype.reset = function (){
        colorwheelself.index = 0;
    }
}

function TaskContainer(user, status, parentElement) {
    
    var tcSelf = this;
    cssClass = 'listview kbTaskHost';

    tcSelf.user = user;
    tcSelf.status = status;
    tcSelf.ui = $("<div id='div_user_" + user.UserID.toString() +
                "_status_" + status.ProjectStatusID.toString() + "' class='" + cssClass + "' ></div>")[0];
    tcSelf.ui.taskContainer = tcSelf;
    tcSelf.colorClass = parentElement.colorClass;
    $(parentElement).append(tcSelf.ui);

    tcSelf.tasks = {};

    TaskContainer.prototype.createTask = function (boardItem) {
        tcSelf = this;
        ti = new TaskItem(boardItem);
        
        ti.createUI(tcSelf);
        tcSelf.tasks[ti.ui.id] = ti;
    }

    TaskContainer.prototype.takeOwnership = function (taskItem) {
    }

}

function TaskItem(boardItem) {

    tiSelf = this;
    tiSelf.item = boardItem;
    tiSelf.parent = null;

    TaskItem.prototype.createUI = function (taskContainer) {
        tiSelf = this;
        tiSelf.parent = taskContainer;
        htmlTaskId = tiSelf.item.TaskID.toString(); // "_user_" + tiSelf.item.UserID.toString() + "_status_" + tiSelf.item.StatusID.toString();
        tiSelf.ui = $("<div id='divTask" + htmlTaskId + "' class='kbTask'></div>")[0];
        $(taskContainer.ui).append(tiSelf.ui);
        //console.log(taskContainer.ui);
        tiSelf.ui.task = tiSelf;
        tiSelfUI = $(tiSelf.ui);
        tiSelfUI.addClass(tiSelf.parent.colorClass + "-vlight");
        span = $("<span id='taskLabel" + htmlTaskId + "'>" + tiSelf.item.Title + "</span>");
        //console.log(span);
        tiSelfUI.append(span);
        tiSelfUI.draggable({
            containment: "#tbBoard",
            opacity: 0.7,
            helper: "clone",
            cursor:"pointer"
            /*,
            drag: function () {
                taskdiv = $(this);
                window.a = taskdiv;
            }*/
        });
        $(".kbTaskHost").droppable({
            hoverClass:'kbTaskHover',
            drop: function (event, ui) {                
                //current = $(this).children("div.listview")[0];
                current = $(this)[0];
                taskItem = ui.draggable[0].task;
                taskItem.changeParent(current.taskContainer);
                return;
            }
        });
    }

    TaskItem.prototype.changeParent = function (newParent) {
        tiSelf = this;
        oldParent = tiSelf.parent;
        $(tiSelf.ui).detach();
        oldParent.tasks[tiSelf.ui.id] = null;
        tiSelf.createUI(newParent);

        tiSelf.item.UserID = tiSelf.parent.user.UserID;
        tiSelf.item.StatusID = tiSelf.parent.status.ProjectStatusID;

        task = {
            'TaskID': tiSelf.item.TaskID, 
            'UserID': tiSelf.item.UserID, 
            'StatusID': tiSelf.item.StatusID,
            'Title':tiSelf.item.Title,
            'Descriptions':tiSelf.item.Description,
            'ProjectID': parseInt ($projectID), // todo
            'TFSTaskID':0
        };

        $.ajax(
        {
            type: "POST",
            url: "/api/board/updatetask",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data:JSON.stringify(task),
            success: function (data) {
            },
            error: function (request, status, error) {
                alert("Could not load Project Status  from database.");
            }
        });
    }
}

