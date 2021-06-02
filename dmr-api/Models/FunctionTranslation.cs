using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.Models
{
    public class FunctionTranslation
    {
        public FunctionTranslation(int functionSystemID, string name, string languageID)
        {
            Name = name;
            LanguageID = languageID;
            CreatedTime = DateTime.Now;
            FunctionSystemID = functionSystemID;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedTime { get; set; }
        public string LanguageID { get; set; }
        public int FunctionSystemID { get; set; }

        public virtual Language Language { get; set; }
        public virtual FunctionSystem FunctionSystem { get; set; }
    }
}
