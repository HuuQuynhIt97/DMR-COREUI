using DMR_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.DTO
{
    public class RemarkDto
    {
        public int ID { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
