# The "test" directory

When `build.sh` is run, is combines the following files into a single file:

test/test-header.html + templates/player-body.html + test/test-footer.html
> test/standalone-player.html

Then the file standalone-player.html can be opened in a browser to test the
player independently, without any learning management system or other web
service.
