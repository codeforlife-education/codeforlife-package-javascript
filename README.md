# codeforlife-package-javascript

This repo hosts Code for Life's Node.js package. This package contains all
reusable frontend code, meant to be installed across CFL's various frontend
services.

## LICENCE

In accordance with the [Terms of Use](https://www.codeforlife.education/terms#terms)
of the Code for Life website, all copyright, trademarks, and other
intellectual property rights in and relating to Code for Life (including all
content of the Code for Life website, the Rapid Router application, the
Kurono application, related software (including any drawn and/or animated
avatars, whether or not such avatars have any modifications) and any other
games, applications or any other content that we make available from time to
time) are owned by Ocado Innovation Limited.

The source code of the Code for Life portal, the Rapid Router application
and the Kurono/aimmo application are [licensed under the GNU Affero General
Public License](https://github.com/codeforlife-education/codeforlife-workspace/blob/main/LICENSE.md).
All other assets including images, logos, sounds etc., are not covered by
this licence and no-one may copy, modify, distribute, show in public or
create any derivative work from these assets.

## Installing as a symlink

To install this package into a CFL frontend before it's been peer-reviewed and
not have to reinstall it every time you make a change, you can install this
package as a [symlink](https://classic.yarnpkg.com/lang/en/docs/cli/link/) by
amending the `dependencies` in the `package.json` of a CFL frontend.

*Remember that the [exports in package.json](package.json#exports) do NOT point
to the source ([src](src/index.ts)) files but rather the distribution
([dist](dist/index.es.js)) files. Therefore, you'll need to rebuild the
distribution files every time you make a change by running `yarn vite build`.*

```json
{
  "dependencies": {
    "codeforlife": "link:../package"
  }
}
```
