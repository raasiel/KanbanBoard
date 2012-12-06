using KanbanBoard.Data;
using KanbanBoard.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml;

namespace KanbanBoard.Controllers
{
    public class HelperController : ApiController
    {
        // GET api/<controller>
        [HttpGet]
        public IEnumerable<Template> Templates()
        {
            var folderPath = System.Web.HttpContext.Current.Server.MapPath("/Content/templates");
            var folder = new System.IO.DirectoryInfo(folderPath);
            var files = folder.GetFiles("*.html");
            var ret = new List<Template>();
            foreach (var file in files)
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(file.FullName);
                XmlNode nd = doc.DocumentElement.SelectSingleNode("//body/div[@id='main']");
                if (nd != null) 
                {
                    var tmpl = new Template();
                    tmpl.Name = file.Name.Substring(0, file.Name.Length - 5);
                    tmpl.Html = nd.InnerXml;
                    ret.Add(tmpl);
                }
            }
            return ret;
        }

        [HttpPost]
        public IEnumerable<Node> GetTfsProjects(TfsConnection conn)
        {
            DataAccess da = new DataAccess();
            return da.GetTfsProjects(conn);
        }
    }
}