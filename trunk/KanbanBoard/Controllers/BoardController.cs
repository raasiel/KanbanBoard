using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using KanbanBoard.Data;

namespace KanbanBoard.Controllers
{
    public class BoardController : ApiController
    {
        // GET api/<controller>
        /*
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }*/

        // GET api/<controller>/5
        public ICollection<BoardItem> Get(int id)
        {
            DataAccess da = new DataAccess();
            return da.GetProjectBoard(id);
        }

        [HttpPost]
        public Task UpdateTask(Task task)
        {
            DataAccess da = new DataAccess();
            return da.UpdateTask(task);            
        }

        [HttpPost]
        public bool DeleteTask(Task task)
        {
            DataAccess da = new DataAccess();
            return da.Delete(task);
        }

 
    }
}