Development Process
=====================

- `git flow feature start feature-<FeatureName>`
  - Will create (and check you out on) a feature branch called 'feature-<FeatureName>'
- Test Locally
- Update the code and commit
- Git Push
- Test Remote
- `git flow feature finish <FeatureName>`
  - Merge the feature branch into the development branch
  - Assuming there are no conflicts, it will delete the feature branch
- `git flow release start X.Y.Z`
  - Will create (and check you out on) a release branch called 'release/X.Y.Z', based on the development branch
- Update your CHANGELOG.md file in your root directory
  ```(markdown)
    ## ChangeLog
  
    ### vX.Y.Z
    - Fixed blah blah
    - Other note
    
    ### vX.Y.Y
    - Other old changes
    - Other stuff from this older releases
  ```
- Update the version number in package.json
- Commit and push
- `git flow release finish X.Y.Z`
  - You will be prompted for a tag name and comments
  - Merges the release branch into master. 
  - Merges the release branch back into development.
  - Checks you out on development
  - Deletes the release branch


