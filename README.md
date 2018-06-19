# 'a' like alias or like abrégé

Command line made easy.

CLI for improving [developer experience (DX)](https://hackernoon.com/developer-experience-dx-devs-are-people-too-6590d6577afe).


## The problem

Using `git`, `docker`, `kubernetes`, etc. command line is sometimes difficult, because of lack of consistency in their syntax.

In other words, if you don't want to bother remembering all `git`, `docker`, etc. command lines by heart, you can be interested by this tool.


## The proposed solution 

All usability tricks that can help you to remember. 

1) REST style: think in resource and CRUD verbs
2) Abbreviate, use short command line.
3) HATEOAS : getting the resources gives you the command syntax you may expect to do.
    - Just read the screen! Do not use your short term memory, think about the [Miller number], or read the Suzan Weinschenk thing #23.(https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two).
4) Extensibility: everyone can add its plugins and share them on github and npm.
5) Power of habit : -h, -v, help, etc.

We want this software to be developed by doing a lot of user testing with all kind of developers.

- people that regularely use a command line.
    - people that knows git
    - people that do not know git
- people that are not used to the command line.


# Install

```
npm i -g @jlguenego/a
```

# Use

Let's start!

```
$> a
Current mode: git

a branch
a commit
a modified
a remote
a repository
```

By default the software is in git mode. So this will list all git specific resources.
You can change the mode to `docker` using:
```
$> a -m docker
```

You can list the modes by doing:
```
$> a -m
```

The `-m` options is in fact an alias on a core hidden resource called `.mode`.

All the core resources are hidden but always accessible. They all with a dot character ".".
You can list them by doing:

```
$> a -c

Core resources:

a .config
a .mode
a .plugin
a .tutorial
```

The generic syntax is:

```
$> a <resource> <verb> <args...>
```

where:

- `<resource>` is an abbreviated or fullname of a resource,
- `<verb>` is an abbreviated or fullname of a verb,
- `<args...> are arguments sometimes needed given the resource and verb.

# Tutorial

For you the most interesting should be the tutorial resource.

All resources and verbs can be disambiguated while using abbreviation, so this very short command would work:

```
$> a .t
```

If you prefer typing the full resource name and verb, the equivalent of the above is:

```
$> a .tutorial list
```

When the verb is not specified, the `list` verb is assumed. This is like in REST style architecture.

You should learn intuitively the rest in the tutorial. It is its purpose.

# Issues

Technical and Usability issues are welcome.
Please go to https://github.com/jlguenego/a/issues.

# Author

Jean-Louis GUENEGO <jlguenego@gmail.com> (https://jlg-consulting.com)

Special thanks to:

- Dany PHENGSIAROUN (https://github.com/dphengsiaroun)