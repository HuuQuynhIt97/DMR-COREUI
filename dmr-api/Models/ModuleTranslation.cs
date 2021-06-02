using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.Models
{
    public class ModuleTranslation
    {
        public ModuleTranslation(int moduleID, string name, string languageID)
        {
            Name = name;
            LanguageID = languageID;
            ModuleID = moduleID;
            CreatedTime = DateTime.Now;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedTime { get; set; }
        public string LanguageID { get; set; }
        public int ModuleID { get; set; }

        public virtual Language Language { get; set; }
        public virtual Module Module { get; set; }
    }
}
