## 2024-03-08 - Missing ARIA Labels on Search Inputs
**Learning:** Search inputs in this application (like in SearchBar and FullTorqueTable) relied entirely on visual placeholders for context, making them inaccessible to screen reader users who cannot see the placeholder text.
**Action:** Always include explicit `aria-label` attributes or linked `<label>` elements for all standalone input fields, even if a visual placeholder is present.
