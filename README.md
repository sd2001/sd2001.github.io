# sd2001.github.io

This branch holds the **published site**. GitHub Pages serves it from `main` at the domain
root, so what you see here is build output, not source.

**The source lives on the [`v2-gym-portfolio`](../../tree/v2-gym-portfolio) branch.** Edit
there, run `npm run build`, and publish the contents of `dist/` here.

Why it is arranged this way: Pages on this repo is set to "deploy from a branch" (`main` /
root). Serving a Vite app that way means the built files have to sit at the root, which is
incompatible with keeping the sources there too.

Switch **Settings → Pages → Source** to **GitHub Actions** and the workflow already on the
source branch takes over, at which point this split is no longer needed.
