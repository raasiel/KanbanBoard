using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.Framework.Client;
using Microsoft.TeamFoundation.Framework.Common;
using Microsoft.TeamFoundation.WorkItemTracking.Client;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Net;

namespace KanbanBoard.Data
{
    public class DataAccess
    {
        private void Test()
        {
            
            TfsConfigurationServer configServer = new TfsConfigurationServer(
                new Uri("https://cmr.wkglobal.com:8088/tfs"), 
                new NetworkCredential("Shafqat.Ahmed", "Hello123", "NA"));
            configServer.Authenticate();

            var catalog = configServer.CatalogNode;
            var tpcNodes = catalog.QueryChildren(
                new Guid[] { CatalogResourceTypes.ProjectCollection },
                false, CatalogQueryOptions.None);

            TfsTeamProjectCollection collection = null;
            foreach (var tpcNode in tpcNodes)
            {
                Guid tpcId = new Guid(tpcNode.Resource.Properties["InstanceId"]);
                var tpc = configServer.GetTeamProjectCollection(tpcId);

                // Get catalog of tp = 'Team Projects' for the tpc = 'Team Project Collection'
                var tpNodes = tpcNode.QueryChildren(
                          new Guid[] { CatalogResourceTypes.TeamProject },
                          false, CatalogQueryOptions.None);

                foreach (var p in tpNodes)
                {
                    if (p.Resource.DisplayName == "AML_Module")
                    {
                        collection = tpc;
                    }
                }
            }


            WorkItemStore workItemStore = (WorkItemStore) collection.GetService(typeof(WorkItemStore)); 
            string qry = "SELECT [Title] From WorkItems Where [Work Item Type] = 'Bug' "  + 
                " AND [Iteration Path] = 'AML_Module\\Release 3\\Sprint 4' AND [Team Project]='AML_Module'";

            var res = workItemStore.Query (qry);
            foreach ( var wi in res)
            {
                string s = wi.ToString();
            }

        }

        public IEnumerable<Node> GetTfsProjects(TfsConnection conn)
        {
            var cols = new List<Node>();
            var configServer = new TfsConfigurationServer(
                new Uri(conn.TfsUrl),
                new NetworkCredential(conn.Username, conn.Password, conn.Domain));
            configServer.Authenticate();

            var catalog = configServer.CatalogNode;
            var tpcNodes = catalog.QueryChildren(
                new Guid[] { CatalogResourceTypes.ProjectCollection },
                false, CatalogQueryOptions.None);

            foreach (var tpcNode in tpcNodes)
            {
                Node nd = new Node();
                
                Guid tpcId = new Guid(tpcNode.Resource.Properties["InstanceId"]);
                nd.Properties.Add(new Item("guid", tpcId.ToString()));
                nd.Name = tpcNode.Resource.DisplayName;
                cols.Add(nd);
                var tpc = configServer.GetTeamProjectCollection(tpcId);

                // Get catalog of tp = 'Team Projects' for the tpc = 'Team Project Collection'
                var tpNodes = tpcNode.QueryChildren(
                          new Guid[] { CatalogResourceTypes.TeamProject },
                          false, CatalogQueryOptions.None);

                foreach (var p in tpNodes)
                {
                    var ndProj = new Node();
                    ndProj.Name = p.Resource.DisplayName;
                    nd.Children.Add(ndProj);
                }
            }

            return cols;

            /*
            WorkItemStore workItemStore = (WorkItemStore)collection.GetService(typeof(WorkItemStore));
            string qry = "SELECT [Title] From WorkItems Where [Work Item Type] = 'Bug' " +
                " AND [Iteration Path] = 'AML_Module\\Release 3\\Sprint 4' AND [Team Project]='AML_Module'";

            var res = workItemStore.Query(qry);
            foreach (var wi in res)
            {
                string s = wi.ToString();
            }*/

        }


        public void SyncTfs()
        {

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
                tsk.Descriptions = task.Descriptions;
                tsk.UserID = task.UserID;
                tsk.StatusID = task.StatusID;                                
            }
            kt.SaveChanges();
            return true;
        }

    }
}
