using crudbase.Models.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crudbase.Controllers
{
    public class CompanyController : Controller
    {
        // GET: Company
        public ActionResult CreateUser()
        {
            return View();
        }

        public ActionResult CreateUserPrevious(UserInformation u)
        {
            return View("CreateUserInformation", u);
        }

        public ActionResult CreateUserInformation()
        {
            if (ModelState.IsValid)
                return View("CreateUserCompanyInformation");
            return View("CreateUserInformation");
        }

        public ActionResult CreateUserCompanyInformation(UserCompanyInformation uc, UserInformation u)
        {
            if (ModelState.IsValid)
                return Content("Obrigado por submeter sua informacao");
            return View("CreateUserCompanyInformation");
        }
    }
}