using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KanbanBoard.Data
{

    [DataContractAttribute]
    public class Node
    {
        private List<Node> _children = new List<Node>();
        private List<Item> _properties = new List<Item>();

        public Node()
        {
        }

        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public IList<Node> Children { get { return _children; } }
        [DataMember]
        public IList<Item> Properties { get { return _properties; } }

    }

    [DataContractAttribute]
    public class Item
    {
        public Item()
        {
        }

        public Item(string name, string value)
        {
            this.Name = name;
            this.Value = value;
        }

        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Value { get; set; }
    }

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
