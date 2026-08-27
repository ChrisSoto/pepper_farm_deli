# Pepper Farm Deli Accessibility Audit

Target: WCAG 2.2 Level AA. Reviewed the live homepage, menu, contact form, catering inquiry, desktop navigation, and mobile navigation on 2026-08-24.

## Required remediation

1. Add a visible-on-focus skip link to the main content.
2. Fix color contrast: footer links measure about 2.82:1; form labels about 1.8:1; required text about 1.9:1. Normal text needs at least 4.5:1.
3. Give every linked product image an accurate accessible name; several homepage image-only links have missing/empty alt text.
4. Add a descriptive `title` to the Google Maps iframe.
5. Remove the duplicate `header-order-link` ID used by desktop and mobile navigation.
6. Correct heading structure: the homepage has two H1 elements and jumps from H1 to H3/H4. Use one page H1 and sequential section headings.
7. Make validation accessible: add inline text errors, associate them with fields using `aria-describedby`, set `aria-invalid`, move focus to the first error, and announce the error summary with `role="alert"` or `aria-live`. Do not rely on red backgrounds and JavaScript alerts.
8. Announce successful form submission inline and move focus to the confirmation; do not rely on `alert()`.
9. Ensure all keyboard focus indicators are clearly visible and meet 3:1 contrast; test every link, button, form field, menu jump link, and Back to Top control.
10. Add `autocomplete` tokens to identity/contact fields (`name`, `email`, `tel`) and clear input instructions/examples.
11. Provide keyboard- and screen-reader-operable accordion behavior with real buttons, `aria-expanded`, `aria-controls`, and correct hidden state.
12. Respect `prefers-reduced-motion` for smooth scrolling, marquees, hover growth, and sliding accordions.
13. Fix mobile navigation completeness: Contact Us and Home text links disappear; ensure all key destinations remain available and the active page is exposed with `aria-current="page"`.
14. Verify all touch targets meet WCAG 2.2's 24x24 CSS-pixel minimum with sufficient spacing.
15. Give icons meaningful alt text when informative (for example, `Map` or `Phone`) and empty alt text when decorative; repeated `store hours icon` labels are inaccurate.
16. Repair missing menu images and keep fallback alt text specific to the product instead of `This image is missing`.
17. Label prices programmatically with currency (for example, `$11.99`) rather than exposing bare numbers.
18. Mark decorative star ratings/images as decorative, or expose one concise label such as `5 out of 5 stars`.
19. Warn users when links open a new tab, and add `rel="noopener noreferrer"` consistently.
20. Test at 200% and 400% zoom, 320 CSS-pixel reflow, high contrast/forced colors, screen readers, and keyboard-only navigation before claiming compliance.

Automated checks cannot establish ADA compliance by themselves; legal review and manual assistive-technology testing remain necessary.
