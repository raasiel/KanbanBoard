using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.WorkItemTracking.Client;
using System.Collections.Generic;
using System.Linq;

namespace KanbanBoard.Data
{
    public class DataAccess
    {
        private void Test()
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();
            TeamFoundationServer tiServer = TeamFoundationServerFactory.GetServer ("https://cmr.wkglobal.com:8088");
            //tiServer.Credentials = new System.Net.NetworkCredential ("Shafqat.Ahmed", "Hello123","NA");
            tiServer.Authenticate();

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


        public ICollection<Project> GetProjectsForUser(int userID)
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            var result = from usr in kt.Users
                         where usr.UserID == userID
                         select usr;
            foreach (var usr in result)
            {
                return usr.Projects;
            }
            return null;

        }

        public bool UpdateTask(Task task)
        {
            KanbanBoard.Data.KanbanTFSEntities kt = new KanbanTFSEntities();

            var result = from tsk in kt.Tasks
                         where tsk.TaskID == task.TaskID
                         select tsk;
            foreach (var tsk in result)
            {
                tsk.ProjectID = task.ProjectID;
                tsk.TFSTaskID = task.TFSTaskID;
                tsk.Title = task.Title;
                //tsk.Descriptions = task.Descriptions;
                tsk.UserID = task.UserID;
                tsk.StatusID = task.StatusID;
                
                
            }
            kt.SaveChanges();
            return true;
        }

    }
}
