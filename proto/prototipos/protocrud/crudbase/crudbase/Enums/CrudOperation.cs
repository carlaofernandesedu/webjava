using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crudbase.Enums
{
    #region Enumeradores de outras classes
    [Flags]
    public enum CrudOperation
    {
        None = 0,
        Create = 1,
        Retrieve = Create << 1,
        Save = Retrieve << 1,
        Delete = Save << 1,
        GoBack = Delete << 1,
        Specific = GoBack << 1,
        CrudBasic = Create | Retrieve | Save | Delete | GoBack,
        All = Create | Retrieve | Save | Delete | GoBack
    }
    #endregion

}