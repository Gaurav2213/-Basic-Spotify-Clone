# Remove the inner repo from being tracked
git rm --cached -r Music-Player

# Delete the .git folder inside Music-Player
rm -rf Music-Player/.git
