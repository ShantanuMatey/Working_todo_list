A small, self-contained web TODO app saved in your browser `localStorage`.

This is a small, self-contained TODO web app (HTML/CSS/JavaScript) stored in this workspace for quick local task tracking.

## Quick Start
- Open `index.html` in your browser (double-click or serve with a static server).
- Alternatively, serve the folder with a tiny static server (recommended for proper file/URL behavior):

```powershell
# from project root
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

## Features
- Add, edit, delete tasks
- Mark tasks complete / undo
- Filters: All / Active / Completed
- CSV export and basic CSV import
- Dark / Light theme with persisted preference
- Local persistence via `localStorage` (key: `todo_tasks_v1`)
- Keyboard shortcut: `/` focuses search
- Animated add & delete transitions

## Files
- `index.html` — app UI and layout
- `styles.css` — theme, layout, animations
- `app.js` — app logic: storage, rendering, handlers, export/import
- `TODO.md` — development checklist and tracker

## How data is stored
Tasks are saved locally in the browser using `localStorage` under the key `todo_tasks_v1`. No server or remote sync is used.

## Usage Notes & Tips
- When editing a task, the form switches into edit mode; submit to save the edit.
- Use the navbar controls to filter tasks, export the current list to CSV, or clear completed items.
- CSV import expects the export's column order; it's a simple parser intended for round-trip with the export feature.

## Troubleshooting
- If tasks don't appear after adding more than one, try refreshing the page; the app saves to `localStorage` and should reload.
- If the theme or button text appears hard to read, toggle the theme in the navbar and re-check — colors persist between reloads.

## Next steps (ideas)
- Improve CSV import robustness
- Add undo for "Clear completed"
- Add per-category filtering and sorting
- Add optional backend sync or export to iCal

## Contributing / Extending
- Edit `app.js` for behavior changes (rendering, storage, import/export).
- Edit `styles.css` to update styling and animations.
- Open issues or requests in this workspace's tracker (or tell me what to implement next).

---
If you'd like, I can implement any of the "Next steps" above—tell me which and I'll update the tracker and code.
A small, self-contained web TODO app saved in your browser `localStorage`.

How to use

- Open `index.html` in a browser (double-click or serve with a static server).
- Add tasks with title, category, priority (Eisenhower), optional due date, estimate and notes.
- Use filters and search to find tasks. Sort by created or due date.
- Export tasks as CSV and import previously exported CSVs.

Files

- `index.html` — main UI
- `styles.css` — simple styles
- `app.js` — all client logic (add/edit/delete, localStorage, export/import)

Next steps (optional)

- Add reminders/notifications using the Notifications API or calendar integration.
- Add sync with a backend or third-party services (Todoist/Notion).
- Add unit tests and accessibility improvements.
