using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KanbanBoard.Data;

namespace KanbanBoard.Controllers
{
    public class ProjectController : ApiController
    {

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

        [HttpGet]
        public ICollection<Project> UserProjects(int id)
        {
            DataAccess da = new DataAccess();
            return da.GetProjectsForUser(id);
        }
    }
}