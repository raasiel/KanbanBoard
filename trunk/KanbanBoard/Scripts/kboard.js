$projectID = 2;
if ($projectID == null) { $projectID = "2"; }

function _(text) {
    console.log(text);
}

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

function FocusHelper(kanbanBoard) {
    foc = this;
    foc.board = kanbanBoard;

    // set up the keyboard handler
    document.clearAction = function () {
        document.actionExecute = null;
        document.actionCancel = null;
    }

    document.setAction = function (execute, cancel) {
        document.actionExecute = execute;
        document.actionCancel = cancel;
    }

    $(document).live("keydown", foc.keyboardHandler);
    $(".kbTaskHost,.kbTask").live("click", foc.onClickHandler);
}

FocusHelper.classFocused = "selected";
FocusHelper.MODE_TASK_BROWSE = "task_browse";
FocusHelper.MODE_TASK_EDIT = "task_edit";

FocusHelper.prototype.currentRowIndex = 1;
FocusHelper.prototype.currentColIndex = 1;
FocusHelper.prototype.currentItemIndex = 0;
FocusHelper.prototype.currentItem = null;
FocusHelper.prototype.mode = FocusHelper.MODE_TASK_BROWSE
FocusHelper.prototype.onClickHandler = function (e) {
    
    elmCheck = e.srcElement;
    if (e.srcElement.tagName == "SPAN") {
        elmCheck = e.srcElement.parentElement;
    }

    if ($(elmCheck).hasClass("kbTask")) {

        parent = $(elmCheck.parentElement.parentElement);
        foc.currentRowIndex = parseInt(parent.attr("row"));
        foc.currentColIndex = parseInt(parent.attr("col"));

        for (i = 0; i < elmCheck.parentElement.childNodes.length; i++) {
            if (elmCheck.parentElement.childNodes[i].id == elmCheck.id) {
                foc.currentItemIndex = i;
                break;
            }
        }
    } else if ($(elmCheck).hasClass("kbTaskHost")) {
        parent = $(elmCheck.parentElement);
        foc.currentRowIndex = parseInt(parent.attr("row"));
        foc.currentColIndex = parseInt(parent.attr("col"));
        foc.currentItemIndex = 0;
    } 
    //_([foc.currentRowIndex, foc.currentColIndex, foc.currentItemIndex]);

    foc.showFocus();
    return false;
}



FocusHelper.prototype.keyboardHandler = function (e) {

    if (e.which == 13) {
        if (document.actionExecute != null) {
            elm = document.activeElement;
            if (elm != null) {
                if (elm.tagName != "TEXTAREA" && $(elm).hasClass("dd-select")==false) {
                    document.actionExecute();
                }
            }
        }
        else if (foc.currentItem != null) {
            if (foc.currentItem.task != null) {
                $kb.showTask(foc.currentItem.task.item);
            }
        }
    }
    else if (e.which == 27) {
        if (document.actionCancel != null) {
            document.actionCancel();
        }
    }
        /*
    else if (e.which == 9) {
        taskdivs = $(".kbTask");
        if (selectedTaskIndex != -1) {
            $(taskdivs[selectedTaskIndex]).toggleClass("selected");
        }
        if (e.shiftKey == false) {
            selectedTaskIndex++;
        }
        else {
            selectedTaskIndex--;
        }
        $(taskdivs[selectedTaskIndex]).toggleClass("selected");
        return false;
    }*/
 
    
    keycode = e.which;
    if (keycode == 45 && foc.mode == FocusHelper.MODE_TASK_BROWSE) {
        tcContainer = null;
        
        if ($(foc.currentItem).hasClass("kbTaskHost")) {
            tcContainer = foc.currentItem.taskContainer;
        } else if ($(foc.currentItem).hasClass("kbTask")) {            
            tcContainer = foc.currentItem.task.parent;
            foc.currentItem = tcContainer.ui;
        }
        _(tcContainer);
        foc.board.newTask(tcContainer.user.UserID, tcContainer.status.ProjectStatusID);
    }

    if (keycode == 46 && foc.mode == FocusHelper.MODE_TASK_BROWSE) {
        if ($(foc.currentItem).hasClass("kbTask")) {
            response = confirm("Are you sure you want to delete this task?");
            if (response == true) {
                $.ajax(
                {
                    type: "POST",
                    url: "/api/board/deletetask",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(foc.currentItem.task.item),
                    success: function (data) {
                        foc.currentItem.task.parent.tasks[foc.currentItem.task.ui.id] = null;
                        $(foc.currentItem.task.ui).remove();
                        foc.showFocus();
                    },
                    error: function (request, status, error) {
                        alert("Could not delete task.");
                    }
                });
            }
        }
    }


    if (keycode >= 37 && keycode <= 40 && foc.mode == FocusHelper.MODE_TASK_BROWSE) {

        rows = $("#divBoard tbody tr");
        maxrow = rows.length;
        maxcol = rows[0].children.length;

        if (keycode == 37) {
            foc.currentColIndex--;
            foc.currentItemIndex = 0;
            if (foc.currentColIndex < 1) {
                foc.currentColIndex = maxcol;
            }
        }
        if (keycode == 38) {

            moveUp = false;
            if (foc.currentItem != null) {
                if ($(foc.currentItem).hasClass("kbTask")) {
                    parent = $(foc.currentItem).parent()[0];
                    if (foc.currentItemIndex - 1 <0) {
                        foc.currentItemIndex = 0;
                        moveUp = true;
                    } else {
                        foc.currentItemIndex--;
                    }
                } else {
                    moveUp = true;
                }
            } else {
                moveUp = true;
            }
            if (moveUp) {
                foc.currentItemIndex = 0;
                if (foc.currentRowIndex < 0) {                    
                    foc.currentRowIndex = 1;
                } else {
                    foc.currentRowIndex = foc.currentRowIndex - 2;
                }

                probableCell = $("#divBoard tbody tr")[foc.currentRowIndex].children[foc.currentColIndex];
                //_([probableCell.children.length, $(probableCell).text(), probableCell]);
                if (probableCell.children[0].children.length > 1) {                    
                    foc.currentItemIndex = probableCell.children[0].children.length-1;
                }
                /* _($(probableCell).text()); */
            }
        }
        if (keycode == 39) {
            foc.currentColIndex++;
            foc.currentItemIndex = 0;
            if (foc.currentColIndex >= maxcol) {
                foc.currentColIndex = 1;
            }
        }
        if (keycode == 40) {            
            moveDown = false;
            if (foc.currentItem != null) {
                if ($(foc.currentItem).hasClass("kbTask")) {
                    //_("Is a task")
                    parent = $(foc.currentItem).parent()[0];
                    if (foc.currentItemIndex +1 >= parent.children.length) {
                        //_("Is a task end")
                        foc.currentItemIndex = 0;
                        moveDown = true;
                    } else {
                        //_("task increamented")
                        foc.currentItemIndex++;
                    }
                } else {
                    //_("Is a host")
                    moveDown = true;
                }
            } else {
                //_("Is null")
                moveDown = true;
            }
            if (moveDown) {
                //_("moving down");
                if (foc.currentRowIndex+1 >= maxrow) {
                    foc.currentItemIndex = 0;
                    foc.currentRowIndex = 1;
                } else {
                    foc.currentItemIndex = 0;
                    foc.currentRowIndex = foc.currentRowIndex + 2;
                }
            }            
        }

        foc.showFocus();
        //_([foc.currentRowIndex, foc.currentColIndex]);
        return false;
    }
    return true;
}

FocusHelper.prototype.showFocus = function () {
    $("." + FocusHelper.classFocused).removeClass(FocusHelper.classFocused);
    cell = $("#divBoard tbody tr")[foc.currentRowIndex].children[foc.currentColIndex];
    taskContainer = cell.children[0];
    if (taskContainer.children.length > 0) {
        foc.currentItem = taskContainer.children[foc.currentItemIndex]
        $(foc.currentItem).addClass(FocusHelper.classFocused);
    }
    else {
        foc.currentItem = taskContainer;
        $(taskContainer).addClass(FocusHelper.classFocused);
    }
}

FocusHelper.prototype.getCurrentTaskContainer = function () {
    cell = $("#divBoard tbody tr")[foc.currentRowIndex].children[foc.currentColIndex];
    taskContainer = cell.children[0].taskContainer;
    return taskContainer;
}

function KanbanBoard() {
    this.keyboard = new FocusHelper(this);
}

KanbanBoard.prototype.init = function (){

    kbSelf = this;
    var seq = new Sequencer($kb);

    seq.queueFunc(this.loadUITemplates, null);
    seq.queueFunc(this.getProjectStatuses, null);
    seq.queueFunc(this.getProjectUsers, null);
    seq.queueFunc(this.getProjectItems, null);
    seq.queueFunc(this.showBoard, null);
    seq.queueFunc(this.loadProjectItems, null);

    seq.execute();

}


KanbanBoard.prototype.showBoard = function (callback, args) {
    
    kbSelf = this.state;

    board = $("#divBoard");

    boardTable = $("<table id='tblBoard' class='kbBoardTable' cellspacing='0' cellpadding='0'></table>");
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
            "' class='" + colors.nextColor('bg') + "-light kbTaskHeader' style='width:150px' >" + projStatus.Name + "</th>")
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

            td.attr("row", ((i*2) +1).toString());
            td.attr("col", (j+1).toString());

                
            colorClass = colors.nextColor('bg');
            td[0].colorClass = colorClass;
            tdIndicator = $("<td id='cell_indicator_user_" + user.UserID.toString() +
                "_status_" + projStatus.ProjectStatusID.toString() +
                "' class='" + colorClass + "-vlight kbTaskIndicator'></td>")
            container = new TaskContainer(user, projStatus, td[0]);
            tr.append(td);
            trIndicator.append(tdIndicator);
        }
        tbody.append(trIndicator);
        tbody.append(tr);
    }
    boardTable.append(tbody);
    //$kb.showNewTask();

    if (callback != undefined && callback != null) {
        callback.onExecutionComplete(callback);
    }    
}

KanbanBoard.prototype.loadUITemplates= function (callback, args) {
    kbSelf = this.state;

    $.ajax(
    {
        type: "GET",
        url: "/api/helper/templates/",
        contentType: "application/json; c-harset=utf-8",
        dataType: "json",
        success: function (data) {
            kbSelf.templates ={};
            $.each(data, function (index, value) {
                kbSelf.templates[value.Name] = value.Html;
            });

            if (callback != undefined && callback != null) {
                callback.onExecutionComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
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

KanbanBoard.prototype.newTask = function (userID, statusID) {
    task = {
        'TaskID': 99999,
        'UserID': userID,
        'StatusID': statusID,
        'Title': '(New Task)',
        'Descriptions': '',
        'ProjectID': parseInt($projectID), // todo
        'TFSTaskID': 0
    };
    kbSelf.showTask(task);
}

KanbanBoard.prototype.showTask = function (task) {
    kbSelf = this;

    if (task == null) {
        task = {
            'TaskID': 99999,
            'UserID': null,
            'StatusID': null,
            'Title': '(New Task)',
            'Descriptions': '',
            'ProjectID': parseInt($projectID), // todo
            'TFSTaskID': 0
        };
    }

    saveFunc = null;
    taskitem = null;
    try{
        taskitem = $("#divTask" + task.TaskID.toString())[0].task
    } catch (e) { }
    
    saveFunc = function (updatedObject) {
        if (taskitem != null) {
            taskitem = $("#divTask" + task.TaskID.toString())[0].task
            taskitem.save(function () {
                taskitem.recreate();
                kbSelf.keyboard.showFocus();
            });
        } 
        else {
            // Where to insert the new task 
            
            boardItem = kbSelf.boardItemFromTask(updatedObject);
            taskContainer = kbSelf.keyboard.getCurrentTaskContainer();
            taskitem = taskContainer.createTask(boarditem);
            taskitem.save(function () {
                taskitem.recreate();
                kbSelf.keyboard.showFocus();
            });
        }
    } 

    kbSelf.keyboard.mode = FocusHelper.MODE_TASK_EDIT;

    listData = { 'UserID': [], 'StatusID': [] }
    $.each($kb.projectUsers, function (index, user) {
        listData.UserID.push({
            text: user.Name,
            value: user.UserID.toString(),
            selected: false,
            description: user.Email,
            imageSrc: null
        });
    });

    $.each($kb.projectStatuses, function (index, stat) {
        listData.StatusID.push({
            text: stat.Name,
            value: stat.ProjectStatusID.toString(),
            selected: false,
            description: "",
            imageSrc: null
        });
    });

    handle = kbSelf.showScreen('task_entry', listData, saveFunc);

    kbSelf.objectToScreen(handle, task);
}

KanbanBoard.prototype.boardItemFromTask = function (task, userid, statusid) {
    
    boarditem = {
        'TaskID': task.TaskID,
        'UserID': task.UserID,
        'StatusID': task.StatusID,
        'Title': task.Title,
        'Descriptions': task.Descriptions,
        'ProjectID': task.ProjectID,
        'TFSTaskID': task.TFSTaskID
    };
    
    return boarditem;


}

KanbanBoard.prototype.objectToScreen = function (screenId, object) {
    //_(["object to screen" , object] )
    $.each(object, function (name, value) {
        find = "#" + screenId + " " + "[field='" + name + "']";
        found = $(find);
        if (found.hasClass("dd-container")) {
            //found.data().selectedData.value
        }
        else {
            found.val(value);
        }
    });
    $("#" + screenId)[0].object = object;
}

KanbanBoard.prototype.screenToObject = function (screenId) {
    
    object = $("#" + screenId)[0].object;
    //_(["Screen to object", object]);
    $.each(object, function (name, value) {
        find = "#" + screenId + " " + "[field='" + name + "']";
        found = $(find);
        //_(find, found);
        if (found.length > 0) {
            $(found);
            if (found.hasClass("dd-container")) {
                object[name] = found.data().ddslick.selectedData.value;
            }
            else {
                object[name] = found.val();
            }
        }
    });
    //_(["Screen to object update", object]);
    return object;
}

screenCount = 0;

KanbanBoard.prototype.showScreen = function (templateName, selectLists, updateObject) {
    kbSelf = this;
    
    // Make the trasparent div 
    blockUI = $("<div id='blockUI' class='blockui'></div>");
    $("div#body").append(blockUI);    
    viewportWidth = $(window).width();
    viewportHeight = $(window).height();
    blockUI.css("width", viewportWidth.toString() + "px").css("height", viewportHeight.toString() + "px");

    // This is the main visible host for the pop up screen
    divScreen = $("<div id='divScreen' style='position:relative;width:1px;'></div>");
    newID = "divScreen" + screenCount.toString();
    divScreen.attr("id", newID);
    screenCount++;
    blockUI.append(divScreen);

    // Build the UI from template
    divScreen.append($(kbSelf.templates[templateName]));
    screenRoot = divScreen.children("");
    scrLeft = ((viewportWidth - screenRoot.width()) / 2).toString();
    scrTop = 20; //((viewportHeight - screenRoot.height()) / 2).toString();
    // Now move our 
    divScreen.css('left', scrLeft + "px");
    divScreen.css('top', scrTop + "px");
        
    //divScreen.css("width", screenRoot.width().toString() + "px");
    //$(".screenhost").show("fadeIn", { direction: "right" }, 500);
    $(".screenhost").show();

    $.each(selectLists, function (key, value) {
        find = "#" + newID + " " + "[field='" + key + "']";
        found = $(find);
        //_(value);
        /*
        found.ddslick({
            data:value,
            width: '100%',
            onSelected: function (selectedData){}, 
            enableKeyboard: true,
            keyboard: [{ 'up': 38, 'down': 40, 'select': 32 }]}); 
            */
        $.each(value, function (index, data) {
            found.append("<option value='" + data.value + "'>" + data.text + "</option>");
        });        
    });
    //slickSelect();
    //setTimeout("slickSelect()", 1000);

    funcExecute = function (e) {
        try {
            updatedObj = kbSelf.screenToObject(newID);
            updateObject(updatedObj);
            kbSelf.destroyScreen(newID);
            blockUI.remove();
            document.clearAction();
            // TODO
            kbSelf.keyboard.mode = FocusHelper.MODE_TASK_BROWSE;
            kbSelf.keyboard.showFocus();
        } catch (e) { _(e)}
    }

    funcCancel = function (e) {
        kbSelf.destroyScreen(newID);
        blockUI.remove();
        document.clearAction();
        kbSelf.keyboard.mode = FocusHelper.MODE_TASK_BROWSE;
        kbSelf.keyboard.showFocus();
    }

    document.setAction(funcExecute, funcCancel);

    $("[action='execute']").bind("click", funcExecute);
    $("[action='cancel']").bind("click", funcCancel);

    $($(".screenhost input")[0]).focus();

    return newID;
}

KanbanBoard.prototype.destroyScreen = function (screenName) {
    $("#" + screenName).remove();
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
        return ti;
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

        tiSelfUI.append(span);

        tiSelfUI.draggable({
            containment: "#tbBoard",
            opacity: 0.7,
            helper: "clone",
            cursor:"pointer"
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

        tiSelfUI.bind("dblclick", function () {
            $kb.showTask(this.task.item);   
        });
    }

    TaskItem.prototype.refresh = function(){
        tiSelf = this;
        htmlTaskId = tiSelf.item.TaskID.toString();        
        span = $("span#taskLabel" + htmlTaskId).text(tiSelf.item.Title);
    }

    TaskItem.prototype.recreate = function () {
        tiSelf.parent.tasks[tiSelf.ui.id] = null;
        $(tiSelf.ui).remove();
        divHostId = "#div_user_" + tiSelf.item.UserID.toString() + "_status_" + tiSelf.item.StatusID.toString();
        taskContainer = $(divHostId)[0].taskContainer;
        tiSelf.createUI(taskContainer);
        taskContainer.tasks[ti.ui.id] = ti;
    }

    TaskItem.prototype.save = function (afterSave) {
        tiSelf = this;

        task = {
            'TaskID': tiSelf.item.TaskID,
            'UserID': tiSelf.item.UserID,
            'StatusID': tiSelf.item.StatusID,
            'Title': tiSelf.item.Title,
            'Descriptions': tiSelf.item.Descriptions,
            'ProjectID': parseInt($projectID), // todo
            'TFSTaskID': 0
        };

        $.ajax(
        {
            type: "POST",
            url: "/api/board/updatetask",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(task),
            success: function (data) {
                tiSelf.item.TaskID = data.TaskID;
                if (afterSave) {
                    afterSave();
                }
            },  
            error: function (request, status, error) {
                alert("Could not save task status.");
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
        tiSelf.save();
    }
}


/*
tconn = {
    
    'TfsConfigID':0,
    'TfsUrl': 'https://cmr.wkglobal.com:8088/tfs',
    'Username': 'Shafqat.Ahmed',
    'Password': 'Hello123',
    'ProjectCollectionGuid': null,
    'Domain': 'NA'
};


$.ajax(
{
    type: "POST",
    url: "/api/helper/GetTfsProjects",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(tconn),
    success: function (data) {
        console.log(data);
    },
    error: function (request, status, error) {
        alert("Could not load Project Status  from database.");
    }
});*/