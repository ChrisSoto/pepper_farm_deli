# SEO implementation and account handoff

Website changes are prepared on a feature branch for Chris to review. No website deployment or Search Console work is included.

## Measurement

The website retains GTM-PKVBBC2T. New data-layer events:

| Event | Meaning | Parameters |
| --- | --- | --- |
| order_click | User follows a supported ordering link; not a completed purchase | page_path, placement, order_provider |
| phone_click | User selects the phone link; not a completed call | page_path, placement |
| directions_click | User selects a Maps link | page_path, placement |
| catering_inquiry_click | User follows the catering inquiry link | page_path, placement |
| generate_lead | Contact endpoint returns successful JSON confirmation | page_path, form_type |
| form_error | Endpoint fails or returns no confirmation | page_path, form_type |

Legacy order_started_event and landing-phone-click remain for existing tags. Legacy landing-submit-lead now fires after success. Configure only one of the legacy/new events as the corresponding key event to avoid counting twice.

In the existing GTM container, connect the new custom events to the site's existing GA4 Google tag. Map the listed categorical data-layer parameters, and mark generate_lead as a GA4 key event. Keep failed requests and order clicks separate from completed leads/purchases. Do not send form values, names, emails, phone numbers, free text, or URL query strings as event parameters. Verify existing GA4 page-location settings separately.

The connected Analytics account returned no property matching Pepper Farm. GTM/GA4 setup and actual collection remain unverified until the correct account is available. No measurement ID was invented and no production tags were published. Local tests use mocked endpoints and send no inquiries.

## Business Profile

The connected Business Profile account did not list Pepper Farm Deli. The following is ready for the profile manager; it has not been applied:

- Business name: Pepper Farm Deli.
- Address: 235 Town Center Parkway, Suite H, Santee, CA 92071.
- Phone: 619-201-8129.
- Website: https://pepperfarmdeli.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile
- Menu: https://pepperfarmdeli.com/menu/
- Ordering: https://order.toasttab.com/online/pepper-farm-deli-235-town-center-parkway-suite-h
- Check the primary Deli category; consider Sandwich shop and Caterer only if those categories accurately describe the business and are available.
- Confirm current opening hours with the owner, including holiday hours, before changing the profile. Website currently lists Mon–Sat 8am–7pm and Sun 8am–5pm.

Suggested description: “Pepper Farm Deli in Santee serves sandwiches, breakfast, salads, wraps, and catering for group meals. Explore the menu, order online, or contact the deli to discuss an office lunch, party, or family gathering. Visit us at 235 Town Center Parkway, Suite H.”

Obtain the profile's official review link. Suggested neutral request for a receipt or follow-up: “Thanks for visiting Pepper Farm Deli. We'd appreciate an honest Google review about your experience.” Ask consistently without incentives or selecting only satisfied customers. No customer messages have been sent.

## Menu and photo follow-up

Prices, ingredients, and catering portion labels are read from Contentful. Verify them against Toast before Chris merges. The CMS contains a Filet Mignon Wrap Platter option labeled “2 Half Sandwiches” whose internal name says “12 Half Sandwiches”; confirm the intended quantity in the CMS rather than guessing. Minimum orders, delivery fees, and lead times require business confirmation and are not invented on the website.

The generated audit/seo-latest.json lists pages needing original food photographs. Photograph the actual portions, prioritizing popular sandwiches, breakfast wraps, salads, and catering spreads. Add an exterior/entrance photo and a current menu photo to Business Profile when access is available. No substitute stock or generated photos were presented as the deli's food.

## Verification and build

Run npm run all for local development. Run npm test for schema serialization and tracking success/failure checks. Run npm run build for a fresh staged build, full SEO audit, and synchronization into dist. The build removes only obsolete generated HTML inside dist after validation. Images are retained. Run npm run audit:seo to inspect the current dist.

The audit checks titles, descriptions, H1s, canonicals, JSON-LD, internal links/fragments, alt attributes, duplicate titles, and sitemap coverage. It records missing original photos as warnings. It does not certify external service availability or live Google indexing.

Validation on October 1, 2026: production build and tracking tests passed; 230 pages and 230 sitemap URLs passed with zero audit errors. The 150 menu cards exactly match origin/main for item names and prices. The audit lists 56 menu-item pages needing original photographs (plus the menu index). Catering and healthy-food pages were checked at a 390-pixel viewport with no horizontal overflow, and the catering FAQ toggles. npm run all served the local preview successfully.

Apache redirects, compression, and image-cache rules are included for hosting. They require server verification after a future deployment. No live speed improvement or ranking increase is claimed.
