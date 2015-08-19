---
title:  "Active Directory Authentication in ASP.NET MVC 5 with Forms Authentication and Group-Based Authorization"
date:   2014-10-20 9:03:00
description: How to integrate MVC authorization attributes with Active Directory.
---

I know that blog post title is sure a mouth-full, but it describes the whole problem I was trying to solve in a recent project.

#The Project

Let me outline the project briefly.  We were building a report dashboard-type site that will live inside the client's network.  The dashboard gives an overview of various, very important information that relates to how the company is performing on a hourly basis.  So, the dashboard is only available to a certain group of directors.

To limit the solution to the these directors, authentication and authorization would go through their existing Active Directory setup by putting the authorized users in a special AD group.

#The Problem

Getting authentication to work was a snap.  Microsoft provides the System.Web.Security.ActiveDirectoryMembershipProvider
class to use as your membership provider.  Putting an [Authorize] attribute on my action methods or entire controllers was all I needed to get it working (besides, of course, the system.web/authentication web.config updates and a controller to show my login form and handle the submit credentials).

Here's my relevant web.config setup:

{% highlight xml %}
<connectionStrings>
<add name="ADConnectionString" connectionString="<ldap connection string here>" />
</connectionStrings>
…
<authentication mode="Forms">
<forms name=".AuthCookie" loginUrl="~/login"/>
</authentication>
<membership defaultProvider="ADMembershipProvider">
<providers>
<clear/>
<add name="ADMembershipProvider"
type="System.Web.Security.ActiveDirectoryMembershipProvider"
connectionStringName="ADConnectionString"
attributeMapUsername="sAMAccountName"/>
</providers>
</membership>
{% endhighlight %}

The tough part came when I wanted to limit access to users in that AD group. Microsoft doesn't provide a RoleProvider along with its ActiveDirectoryMembershipProvider. So, what to do?

I tried several methods I found online. Most of them were based on creating my own custom RoleProvider and querying AD to iterate through the user's groups (treating them like roles) and seeing if one of them matched my AD group I was looking for. However, I could never get it to work. Each code example I found eventually gave me this AD error when I iterated through the current user's AD groups:

{% highlight %}
The specified directory service attribute or value does not exist.
{% endhighlight %}

The Solution

Eventually, I found a solution online that worked. Instead of setting up a custom RoleProvider, all it involved was creating a custom AuthorizeAttribute for your MVC controllers (or action methods) that checked the user's .IsMemberOf method to see if the member belonged the sought after group (or groups). I don't know why this method does not cause the same AD error as describe above, but I'm glad it doesn't! All I can assume is that it queries AD in a more friendly way.

Here is my custom AuthorizeAttribute:

{% highlight csharp %}
public class AuthorizeADAttribute : AuthorizeAttribute
{
private bool _authenticated;
private bool _authorized;

public string Groups { get; set; }

protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
{
base.HandleUnauthorizedRequest(filterContext);

if (_authenticated && !_authorized)
{
filterContext.Result = new RedirectResult("/error/notauthorized");
}
}

protected override bool AuthorizeCore(HttpContextBase httpContext)
{
_authenticated = base.AuthorizeCore(httpContext);

if (_authenticated)
{
if (string.IsNullOrEmpty(Groups))
{
_authorized = true;
return _authorized;
}

var groups = Groups.Split(',');
string username = httpContext.User.Identity.Name;

try
{
_authorized = LDAPHelper.UserIsMemberOfGroups(username, groups);
return _authorized;
}
catch (Exception ex)
{
this.Log().Error(() => "Error attempting to authorize user", ex);
_authorized = false;
return _authorized;
}
}

_authorized = false;
return _authorized;
}
}
{% endhighlight %}

Notice that I also included a little code to distinguish between the user not being authenticated (which the call to base.AuthorizeCore takes care of) and not being authorized. Without the code in HandleUnauthorizedRequest, if the user successfully logs in but is not in the AD group, he just sees the log in screen again which doesn't communicate the problem very well.

The this.Log() code uses a Nuget packaged called this.Log. The LDAPHelper class is something I wrote. The code is below:

{% highlight csharp %}
public static class LDAPHelper
{
public static string GetLDAPContainer()
{
Uri ldapUri;
ParseLDAPConnectionString(out ldapUri);

return HttpUtility.UrlDecode(ldapUri.PathAndQuery.TrimStart('/'));
}

public static string GetLDAPHost()
{
Uri ldapUri;
ParseLDAPConnectionString(out ldapUri);

return ldapUri.Host;
}

public static bool ParseLDAPConnectionString(out Uri ldapUri)
{
string connString = ConfigurationManager.ConnectionStrings["ADConnectionString"].ConnectionString;

return Uri.TryCreate(connString, UriKind.Absolute, out ldapUri);
}

public static bool UserIsMemberOfGroups(string username, string[] groups)
{
/* Return true immediately if the authorization is not
locked down to any particular AD group */
if (groups == null || groups.Length == 0)
{
return true;
}

// Verify that the user is in the given AD group (if any)
using (var context = BuildPrincipalContext())
{
var userPrincipal = UserPrincipal.FindByIdentity(context,
IdentityType.SamAccountName,
username);

foreach (var group in groups)
{
if (userPrincipal.IsMemberOf(context, IdentityType.Name, group))
{
return true;
}
}
}

return false;
}

public static PrincipalContext BuildPrincipalContext()
{
string container = LDAPHelper.GetLDAPContainer();
return new PrincipalContext(ContextType.Domain, null, container);
}
}
{% endhighlight %}

My code is mostly based on example code I found on a very helpful [StackOverflow post][so-post].

To use this code, all you have to do is use your custom AuthorizeAttribute instead of the built-in one. Something like this:

{% highlight csharp %}
[AuthorizeAD(Groups="Some AD group name")]
public class HomeController : Controller
{
…
}
{% endhighlight %}

[so-post]: http://stackoverflow.com/questions/4342271/asp-net-mvc-forms-authorization-with-active-directory-groups/4383502#4383502
