using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace crudbase.CoreInfra
{
    public static class ObjectExtensions
    {
        public static T ToObject<T>(this IDictionary<string, object> source)
        where T : class, new()
        {
            T someObject = new T();
            Type someObjectType = someObject.GetType();

            foreach (KeyValuePair<string, object> item in source)
            {
                var pi = someObjectType.GetProperty(item.Key);
                if (pi != null)
                {
                    var v = CastPropertyValue(pi, item.Value);

                    pi.SetValue(someObject, v, null);
                }
            }

            return someObject;
        }

        public static IDictionary<string, object> AsDictionary(this object source)
        {
            BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance;

            return source.GetType().GetProperties(bindingAttr).ToDictionary
            (
                propInfo => propInfo.Name,
                propInfo => propInfo.GetValue(source, null)
            );
        }

        public static IDictionary<string, object> AsDictionary(this object source, BindingFlags bindingAttr)
        {
            return source.GetType().GetProperties(bindingAttr).ToDictionary
            (
                propInfo => propInfo.Name,
                propInfo => propInfo.GetValue(source, null)
            );
        }

        public static object CastPropertyValue(PropertyInfo property, object value)
        {
            if (property.PropertyType == typeof(string))
            {
                if (property == null || String.IsNullOrEmpty(value.ToString()))
                    return null;

                return value.ToString();
            }
            else if (property.PropertyType.IsEnum)
            {
                Type enumType = property.PropertyType;
                int index;

                if (Int32.TryParse(value.ToString(), out index))
                {
                    return Enum.GetValues(enumType).GetValue(index - 1);
                }
                else if (Enum.IsDefined(enumType, value))
                {
                    return Enum.Parse(enumType, value.ToString());
                }
                else
                {
                    return null;
                }
            }
            else if (property.PropertyType == typeof(bool))
            {
                return value.ToString() == "1" || value.ToString() == "true" || value.ToString() == "on" || value.ToString() == "checked";
            }
            else if (property.PropertyType == typeof(Uri))
            {
                return new Uri(Convert.ToString(value));
            }
            else if (Nullable.GetUnderlyingType(property.PropertyType) != null)
            {
                Type tipo = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                if (value != null && !string.IsNullOrEmpty(value.ToString()))
                {
                    object safeValue = (value == null) ? null : Convert.ChangeType(value, tipo);
                    return safeValue;
                }

                return Activator.CreateInstance(property.PropertyType);
            }
            else
            {
                return Convert.ChangeType(value, property.PropertyType);
            }
        }

        public static T Cast<T>(this Object sourceObj)
        {
            Type target = typeof(T);

            var x = Activator.CreateInstance(target, false);

            var d = from source in target.GetMembers().ToList()
                    where source.MemberType == MemberTypes.Property
                    select source;

            List<MemberInfo> members = d.Where(memberInfo => d.Select(c => c.Name)
               .ToList().Contains(memberInfo.Name)).ToList();
            PropertyInfo propertyInfo;
            object value;
            foreach (var memberInfo in members)
            {
                propertyInfo = typeof(T).GetProperty(memberInfo.Name);

                var property = sourceObj.GetType().GetProperty(memberInfo.Name);

                if (property != null)
                {
                    value = property.GetValue(sourceObj, null);
                    propertyInfo.SetValue(x, value, null);
                }
            }
            return (T)x;
        }
    }
}