---
layout: post
title:  "Converting an Interface Expression to a Concrete Expression"
date:   2013-01-23
description: "Converting an Interface Expression to a Concrete Expression"
---
I had a case recently where I needed to convert a LINQ expression of the type of an interface and I needed to convert it to be based on a concrete implementation of that interface.  I came up with the  following solution, using an ExpressionVisitor and a simple helper method.

First, the helper method in a static class.

{% highlight csharp %}
internal static Expression<Func<TConcrete, bool>> ConvertToConcreteExpression<TConcrete, TInterface>( Expression<Func<TInterface, bool>> interfaceExpression)
{
  if (!typeof(TInterface).IsAssignableFrom(typeof(TConcrete)))
  {
    throw new Exception("TInterface must be assignable from TConcrete to convert an expression.");
  }

  return TransformVisitor<TConcrete, TInterface>.Transform(interfaceExpression);
}
{% endhighlight %}

Here is the TransformVisitor class.

{% highlight csharp %}
internal class TransformVisitor<TConcrete, TInterface> : ExpressionVisitor
{
  private readonly ParameterExpression _param = Expression.Parameter(typeof(TConcrete), "param_0");

  public static Expression<Func<TConcrete, bool>> Transform(Expression expression)
  {
    var visitor = new TransformVisitor<TConcrete, TInterface>();
    var newLambda = (Expression<Func<TConcrete, bool>>)visitor.Visit(expression);
    return newLambda;
  }

  protected override Expression VisitLambda<T>(Expression<T> node)
  {
    if (typeof(T).IsAssignableFrom(typeof(Func<TInterface, bool>)))
    {
      return Expression.Lambda<Func<TConcrete, bool>>(
        Visit(node.Body),
        _param
      );
    }

    return base.VisitLambda(node);
  }

  protected override Expression VisitMember(MemberExpression node)
  {
    if (node.Member.DeclaringType.IsAssignableFrom(typeof(TInterface)))
    {
      return Expression.MakeMemberAccess(
      Visit(node.Expression),
      typeof(TConcrete).GetProperty(node.Member.Name));
    }

    return base.VisitMember(node);
  }

  protected override Expression VisitParameter(ParameterExpression node)
  {
    if (node.Type.IsAssignableFrom(typeof(TInterface)))
    {
      return _param;
    }

    return base.VisitParameter(node);
  }
}
{% endhighlight %}
