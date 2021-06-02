using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.DTO
{
    public class ModuleDto
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
       
        public string Icon { get; set; }
        public string LanguageID { get; set; }
        public int Sequence { get; set; }
        public int Level { get; set; }
        public DateTime CreatedTime { get; set; }
        public List<Translation> Translations { get; set; }
    }
    public class ModuleTreeDto
    {
        public int Index { get; set; }
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }

        public string Icon { get; set; }
        public string LanguageID { get; set; }
        public int Sequence { get; set; }
        public int Level { get; set; }
        public int ParentID { get; set; }
        public DateTime CreatedTime { get; set; }
        public List<ModuleTreeDto> ChildNodes { get; set; } = new List<ModuleTreeDto>();
    }

    public class Translation
    {
        public string LanguageID { get; set; }
        public string Name { get; set; }
        public int ID { get; set; }

    }
}
