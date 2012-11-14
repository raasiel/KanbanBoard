using System.Collections.Generic;
using System.Linq;

namespace KanbanBoard.Data
{
    public class DataAccess
    {
        private void Test()
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();
        }

        public IQueryable<Project> GetProjects()
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            var result = from prj in kt.Projects
                         select prj;
            return result;
        }

        public IQueryable<ProjectStatus> GetProjectStatuses( int projectID)
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            var result = from prj in kt.ProjectStatus1
                         where prj.ProjectID == projectID
                         select prj;
            return result;
        }

        public IQueryable<User> GetProjectUsers(int projectID)
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            var result = from prj in kt.Projects
                         from usr in prj.Users
                         where prj.ProjectID == projectID
                         select usr;
            return result;
        }
        
        public ICollection<BoardItem> GetProjectBoard(int projectID)
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            List<BoardItem> lst = new List<BoardItem>();
            var result = kt.GetProjectBoard(projectID);

            foreach (var res in result)
            {
                lst.Add(new BoardItem(res));
            }
            return lst;
        }
    }
}
