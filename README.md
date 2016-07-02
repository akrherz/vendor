# vendor
3rd Party JS/CSS Libraries used in various @akrherz apps

Since I write many hacks, I figured I might as well centralize my various
website projects `htdocs/vendor` folders into one location.  It remains to
be seen how I will manage ever removing a particular version from this folder
and verifying that no other project still used it...

My thought was to simply create an apache `vendor.conf` file and then make it
as a default <Location> for all my webfarm projects.

A listing of @akrherz projects using this vendor folder

  * [IEM Website](https://github.com/akrherz/iem.git)
    