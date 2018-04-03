using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace crudbase.Models.Company
{
    public class UserInformation
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [MaxLength(10, ErrorMessage = "First Name max length is 10")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [MaxLength(10, ErrorMessage = "Last Name max length is 10")]
        public string LastName { get; set; }
    }
}