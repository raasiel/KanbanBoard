using KanbanBoard.Data;
using System.Collections.Generic;
using System.Web.Http;

namespace KanbanBoard.Controllers
{
    public class UserController : ApiController
    {

        [HttpGet]
        public ICollection<Project> Get(int id)
        {
            DataAccess da = new DataAccess();
            return da.GetProjectsForUser(id);
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