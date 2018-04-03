using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace crudbase.Models.Company
{
    public class UserCompanyInformation
    {
        public int UserId { get; set; }
        [Required(ErrorMessage = "Company Name is required")]
        [MaxLength(10, ErrorMessage = "Company Name max length is {0}")]
        public string CompanyName { get; set; }

    }
}