---
layout: post
title:  "Using NuGetPackager 0.5.5 with GitVersionTask 3.4.1"
date:   2016-03-03 15:04:00
description: "A quick fix to use NuGetPackager 0.5.5 with GitVersionTask 3.4.1"
categories: [programming]
tags: [nuget,git]
---
I'm using both [NuGetPackager](https://www.nuget.org/packages/NuGetPackager/)
with [GitVersionTask](https://www.nuget.org/packages/GitVersionTask/) on
my project that provides EntityFramework persisters for NServiceBus:
[GoodlyFere.NServiceBus.EntityFramework](https://github.com/benjaminramey/GoodlyFere.NServiceBus.EntityFramework).

NuGetPackager seems to work seamlessly with GitVersionTask 2.0.0.  However,
GitVersionTask is up to version 3.4.1 and I just hate sitting at a version that
far behind!

So, I updated my NuGet package to the latest version of GitVersionTask.  That's
3.4.1 right now.  Too bad, so sad!  That caused this error:

```
The "CreatePackages" task was not given a value for the required parameter "Version".	1
```

## The Problem
The problem turns out that NuGetPackager 0.5.5 is looking for a MSBuild property
called "GfvNuGetVersion".  See the code in the .targets file [here](https://github.com/Particular/NuGetPackager/blob/0.5.6/src/NuGetPackager/NuGetPackager.targets#L5).

GitVersionTask 3.4.1 (somewhere in a release since 2.0.0) changed that property
name to "GitVersion_NuGetVersion".  See the code [here](https://github.com/GitTools/GitVersion/blob/master/src/GitVersionTask/NugetAssets/GitVersionTask.targets#L68).

## The Solution
So, how to fix this?  NuGetPackager will probably be updated some day, but for
now you can just translate the property in your .csproj file before the
CreatePackage task is called in NuGetPackager.

Open up your .csproj file directly in some text editor like Notepad++.  Find
these two lines at the bottom of the file:

```
<Import Project="..\packages\GitVersionTask.3.4.1\Build\dotnet\GitVersionTask.targets"
        Condition="Exists('..\packages\GitVersionTask.3.4.1\Build\dotnet\GitVersionTask.targets')" />
<Import Project="..\packages\NuGetPackager.0.5.5\build\NuGetPackager.targets"
        Condition="Exists('..\packages\NuGetPackager.0.5.5\build\NuGetPackager.targets')" />
```

Before those two lines, add a target and a property group.  The target will
create a task that translates the new property to the new property.  The
property group wil define a BuildDependsOn to call that target before the
CreatePackages target is called.

```
<Target Name="TranslateNugetVersion"
        Condition="'$(Configuration)' == 'Release'">
    <CreateProperty
        Value="$(GitVersion_NuGetVersion)">
        <Output
            TaskParameter="Value"
            PropertyName="GfvNuGetVersion" />
    </CreateProperty>
</Target>
<PropertyGroup>
    <BuildDependsOn>
        $(BuildDependsOn);
        TranslateNugetVersion
    </BuildDependsOn>
</PropertyGroup>
<Import Project="..\packages\GitVersionTask.3.4.1\Build\dotnet\GitVersionTask.targets"
        Condition="Exists('..\packages\GitVersionTask.3.4.1\Build\dotnet\GitVersionTask.targets')" />
<Import Project="..\packages\NuGetPackager.0.5.5\build\NuGetPackager.targets"
        Condition="Exists('..\packages\NuGetPackager.0.5.5\build\NuGetPackager.targets')" />
```

Now, when you build your project, everything should work great!
