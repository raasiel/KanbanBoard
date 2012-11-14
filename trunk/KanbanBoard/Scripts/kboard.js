function FunctionSequencer(kBoard) {
    this.myself = this;
    this.page = kBoard;
    // We store functions and their arguments here
    this.arr = Array();
}

FunctionSequencer.prototype.queueFunc = function (func, args) {
    // Crate a data structure and store the function pointer
    // and the arguments for the function and store in internal 
    // array
    var data = { 'func': func, 'args': args, 'sequencer': this, 'context': this.page }
    this.arr.push(data);
}

FunctionSequencer.prototype.invokeAll = function () {
    // Take the first data structure of function and arguments out
    // then invoke the function pointer with the arguments. Since this is 
    // also pass ourselves as the callback mechanism
    firstItem = this.arr.shift();
    firstItem.func(this, firstItem.args);
}

FunctionSequencer.prototype.onInvokeComplete = function (self) {
    // We are here, that means some function has completed async
    // execution and has called us as the callback. Now we will 
    // check if there are any more functions left in queue (array)
    // and invoke if needed
    if (self.arr.length > 0) {
        seqitem = self.arr.shift();
        seqitem.func(self, seqitem.args);
    }
    else {
        // Nice! All functions in the queue has completed.
    }
}

function KanbanBoard() {
}

KanbanBoard.prototype.showBoard = function () {
    


    var seq = new FunctionSequencer($kb);
    seq.queueFunc(this.getProjectStatuses, null);
    seq.queueFunc(this.getProjectUsers, null);
    seq.queueFunc(this.getProjectItems, null);
    

    seq.queueFunc(function (callback, args) {

        board = $("#divBoard");

        boardTable = $("<table id='tblBoard'></table>");
        board.append(boardTable);

        tr = $("<tr id='row_master'></tr>");
        tr.append("<td></td>");
        
        for (j = 0; j < self.projectStatuses.length; j++) {
            projStatus = self.projectStatuses[j];
            td = $("<td id='cell_master_status_" + projStatus.ProjectStatusID.toString() + "' >" + projStatus.Name + "</td>")
            tr.append(td);
        }
        boardTable.append(tr);

        for (i = 0; i < self.projectUsers.length; i++) {
            user = self.projectUsers[i];
            tr = $("<tr id='row_user_" + user.UserID.toString() + "'></tr>");

            tr.append("<td id='cell_user_master_" + user.UserID.toString() + "' >" + user.Name + "</td>");
            for (j = 0; j < self.projectStatuses.length; j++) {
                projStatus = self.projectStatuses[j];
                td = $("<td id='cell_user_" + user.UserID.toString() +
                    "_status_" + projStatus.ProjectStatusID.toString() + "' ></td>")
                td.append("<div id='div_user_" + user.UserID.toString() +
                    "_status_" + projStatus.ProjectStatusID.toString() + "' ></div>");

                tr.append(td);
            }
            boardTable.append(tr);
        }

        if (callback != undefined && callback != null) {
            callback.onInvokeComplete(callback);
        }
    });
    
    seq.queueFunc(this.loadProjectItems, null);

    seq.invokeAll();
}

KanbanBoard.prototype.loadProjectItems = function (callback, args) {
    self = this.context;

    $.each(self.projectTasks, function (index, item) {
        divHostId = "div_user_" + item.UserID.toString() + "_status_" + item.StatusID.toString();
        $("#" + divHostId).append("<span>" + item.Title + "</span>");
    });

}


KanbanBoard.prototype.getProjectItems = function (callback, args) {
    self = this.context;
    $.ajax(
    {
        type: "GET",
        url: "/api/board/get/1",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            self.projectTasks = data;
            if (callback != undefined && callback != null) {
                callback.onInvokeComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}



KanbanBoard.prototype.getProjectStatuses = function (callback, args) {
    self = this.context;
    $.ajax(
    {
        type: "GET",
        url: "/api/project/statuses/1",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            self.projectStatuses = data;
            if (callback != undefined && callback != null) {
                callback.onInvokeComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}

KanbanBoard.prototype.getProjectUsers = function (callback, args) {
    self = this.context;
    $.ajax(
    {
        type: "GET",
        url: "/api/project/users/1",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            self.projectUsers= data;
            if (callback != undefined && callback != null) {
                callback.onInvokeComplete(callback);
            }
        },
        error: function (request, status, error) {
            alert("Could not load Project Status  from database.");
        }
    });
}



$kb = new KanbanBoard();
$kb.showBoard();