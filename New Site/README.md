# Pepper Farm Deli — New Site

An independent Next.js and React redesign. All application code, copied content, images, and dependencies live in this folder. No production files are needed at runtime.

## Run locally

From this folder, run `npm install` once, then `npm run all`. Open http://localhost:8080.

## Build and deploy

`npm run build` creates the production site in `out`. The public site is served from Google Cloud Run by an Nginx container. The Cloud Run Dockerfile and Nginx configuration are in `.cloudrun-deploy/`.

To prepare a clean deployment, copy the Dockerfile and Nginx configuration into a temporary release folder, copy the contents of `out/` into its `out/` subfolder, then deploy that folder with `gcloud run deploy pepper-farm-deli-new-site --source <release-folder> --region us-west1 --project bubbly-display-303502`. This release process leaves the application source and generated build untouched.

## Content

`data/content.json` holds the imported menu, blog articles, and supporting pages. `public/images` holds local photos. The one-time importer in `scripts/import-content.mjs` can refresh from the original project's generated pages, but is not required to run or build the redesign.

Ordering links open the existing Toast ordering service. Contact and catering forms use the existing site's contact endpoints. Sending a form reaches the business; development checks do not submit messages. Current menu prices and breakfast availability should be confirmed in the ordering system.

The production site allows search indexing, publishes `/robots.txt` and `/sitemap.xml`, and includes page titles and descriptions for its menu and blog entries.
