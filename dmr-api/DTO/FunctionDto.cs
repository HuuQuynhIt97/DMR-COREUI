using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.DTO
{
    public class FunctionDto
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
       
        public string Icon { get; set; }
        public int Sequence { get; set; }
        public int Level { get; set; }
        public int? ModuleID { get; set; }
        public List<Translation> Translations { get; set; }
    }
    public class FunctionTreeDto
    {
        public int ID { get; set; }
        public int Index { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
        public int Sequence { get; set; }
        public int Level { get; set; }
        public int? ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string LanguageID { get; set; }
        public int? ParentID { get; set; }
        public List<FunctionTreeDto> ChildNodes { get; set; }
    }
}
