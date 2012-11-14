using System;
using System.Runtime.Serialization;

namespace KanbanBoard.Data
{
    [DataContractAttribute]
    public class BoardItem 
    {
        public BoardItem(GetProjectBoard_Result item)
            : base()
        {
            this.Comments = item.Comments;
            this.Descriptions = item.Descriptions;
            this.Status = item.Status;
            this.UserID = item.UserID;
            this.StatusID = item.StatusID;
            this.TaskID = item.TaskID;
            this.Title = item.Title;
            this.WIRef = item.WIRef;
        }

        [DataMember]
        public int TaskID { get; set; }
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string Descriptions { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public int StatusID { get; set; }
        [DataMember]
        public int UserID { get; set; }
        [DataMember]
        public Nullable<int> WIRef { get; set; }
    }
}
