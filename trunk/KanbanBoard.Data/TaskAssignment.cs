//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace KanbanBoard.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class TaskAssignment
    {
        public int TaskAssignmentID { get; set; }
        public Nullable<int> TaskID { get; set; }
        public int UserID { get; set; }
        public int StatusID { get; set; }
    
         internal  ProjectStatus ProjectStatus { get; set; }
         internal  Task Task { get; set; }
         internal  User User { get; set; }
    }
}
