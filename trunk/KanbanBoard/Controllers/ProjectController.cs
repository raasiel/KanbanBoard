using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KanbanBoard.Data;

namespace KanbanBoard.Controllers
{
    public class ProjectController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpGet]
        public IQueryable<ProjectStatus> Statuses(int id)
        {
            DataAccess da = new DataAccess();
            return da.GetProjectStatuses(id);
        }

        [HttpGet]
        public IQueryable<User> Users(int id)
        {
            DataAccess da = new DataAccess();
            return da.GetProjectUsers(id);
        }


        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}