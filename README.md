# Mst. Sadia Afrin Shimu Academic Portfolio

This repository contains an academic portfolio website with an optional
Node.js CMS backend.

The public portfolio is still usable as a static website. When the backend is
running, the same public page can hydrate its content from the CMS API and the
site owner can edit content through `/admin/`.

## Project Modes

### Static public site

Use this mode for GitHub Pages or any plain static host.

- Entry file: `index.html`
- Styling: `css/main.css`
- Frontend behavior: `js/main.js`
- Images: `images/`
- No build step required
- No Node server required
- CMS API calls fail silently if no backend exists, so static HTML remains the
  fallback content

### Full CMS site

Use this mode when content editing, image uploads, backups, login, and the
admin dashboard are required.

- Runtime: Node.js
- Server: Express
- Database: lowdb JSON file
- Admin UI: single-file HTML/CSS/JS app at `admin/index.html`
- Auth: session login with bcrypt password hashing
- Uploads: multer image uploads into root `images/`
- Public site served from the same Express server at `/`

## Repository Structure

```text
portfolio/
|-- index.html
|-- css/
|   `-- main.css
|-- js/
|   `-- main.js
|-- images/
|   `-- .gitkeep
|-- fonts/
|   `-- .gitkeep
|-- admin/
|   `-- index.html
|-- server/
|   |-- server.js
|   |-- routes/
|   |   |-- auth.js
|   |   `-- content.js
|   |-- middleware/
|   |   `-- requireAuth.js
|   |-- db/
|   |   |-- database.js
|   |   `-- writerAuth.js
|   `-- data/
|       |-- content.json
|       `-- writer-auth.json
|-- public/
|   `-- images/
|-- package.json
|-- package-lock.json
|-- .env.example
|-- .gitignore
|-- .htaccess
`-- README.md
```

Notes:

- `server/data/content.json` is generated and ignored by git.
- `server/data/writer-auth.json` is generated and ignored by git.
- `images/` is the active image folder used by the public site and CMS uploads.
- `public/images/` is not the active upload target for the current server.
- `fonts/` is reserved for local font assets if they are added later.

## Public Website Structure

The public portfolio is defined in `index.html`. Section order is:

1. Header and navigation
2. Hero
3. About
4. Education
5. Research projects
6. Publications and conference presentations
7. Field experience and map
8. Skills and certificates
9. Leadership and activities
10. Gallery
11. Contact
12. Footer

The visual design lives in `css/main.css`. The public JavaScript in
`js/main.js` handles:

- fixed navbar scroll state
- active navigation link highlighting
- hamburger menu behavior
- smooth scrolling
- reveal animations
- portrait and gallery image fallbacks
- Leaflet map setup
- CMS data hydration when `/api/content/*` is available
- static fallback when the CMS API is unavailable

## Public CMS Targets

`index.html` contains `data-cms` attributes that let the CMS API replace static
HTML content without changing the visual structure.

Current render targets:

```text
hero-eyebrow
hero-tagline
hero-stats
about-bio
about-details
education-list
research-grid
pub-list
conference-list
field-cards
skills-groups
certificates-grid
leadership-grid
gallery-grid
contact-title
contact-subtitle
contact-items
```

If API data is missing or the server is offline, the original static HTML stays
visible.

## Images

The public site expects these paths:

```text
images/portrait.jpg
images/gallery-1.jpg
images/gallery-2.jpg
images/gallery-3.jpg
images/gallery-4.jpg
images/gallery-5.jpg
images/gallery-6.jpg
```

If files are missing, `js/main.js` shows placeholders instead of broken image
icons.

CMS upload behavior:

- Portrait upload saves to `images/portrait.jpg`
- Gallery upload saves generated `gallery-{uuid}.jpg` files into `images/`
- Gallery entries in `content.json` store filenames and captions
- Admin client-side upload validation allows JPG, PNG, and WebP up to 2MB
- Server-side upload validation allows JPG, PNG, and WebP up to 5MB

## External Frontend Assets

The public portfolio loads:

- Google Fonts
- Font Awesome
- Leaflet
- OpenStreetMap tiles

The admin panel loads:

- Quill.js for rich text editing
- SortableJS for drag-to-reorder lists

These are CDN assets and require internet access when used.

## Admin Dashboard

Admin path:

```text
/admin/
```

Admin file:

```text
admin/index.html
```

The admin dashboard is a single file with inline CSS and inline JavaScript. It
uses same-origin API calls and sends credentials with requests.

Admin sections:

```text
Hero
About
Education
Research
Publications
Conference
Field Cards
Map Markers
Skills
Certificates
Leadership
Gallery
Portrait
Contact
Settings
```

Admin features:

- login/logout
- section-based editing
- CRUD for portfolio content
- Quill rich text editing for biography and description textareas
- localStorage autosave every 30 seconds
- "Unsaved changes" badge
- one-click draft restore
- gallery upload with drag/drop or file picker
- portrait upload with preview before upload
- image type and size validation before upload
- gallery caption editing
- drag-to-reorder for education, research, publications, and gallery
- reorder persistence on drop
- content backup download
- password change form in Settings
- responsive layout for small mobile screens

## Backend Structure

### `server/server.js`

Express entry point. It configures:

- dotenv
- Helmet security headers
- CORS
- JSON and URL-encoded body parsing
- express-session
- login rate limiting
- API rate limiting
- static serving for `/images`, `/css`, `/js`, and `/admin`
- public portfolio root route `/`
- `/api/health`
- auth routes
- content routes
- JSON 404 handler for unknown API routes
- global error handler

Static serving paths:

```text
/        -> index.html
/admin/  -> admin/index.html
/css/    -> css/
/js/     -> js/
/images/ -> images/
```

### `server/db/database.js`

Sets up lowdb and the default content seed.

Important exports:

- `rootDir`
- `dataDir`
- `contentFile`
- `publicDir`
- `publicImagesDir`
- `sanitizeFileName()`
- `defaultContent`
- `db`
- `initDb()`
- `saveDb()`

Live content file:

```text
server/data/content.json
```

Top-level content keys:

```text
hero
about
education
research
publications
conference
field_cards
map_markers
skills
certificates
leadership
gallery
contact
```

### `server/db/writerAuth.js`

Handles persistent writer password storage.

Behavior:

- first startup hashes the environment/default writer password
- generated hash is saved to `server/data/writer-auth.json`
- password changes update that file
- no `.env` edit is required after password changes

### `server/routes/auth.js`

Auth routes:

```text
POST /api/login
POST /api/logout
GET  /api/me
POST /api/change-password
```

### `server/routes/content.js`

Content API routes are mounted under:

```text
/api/content
```

Public read routes:

```text
GET /api/content/hero
GET /api/content/about
GET /api/content/education
GET /api/content/research
GET /api/content/publications
GET /api/content/conference
GET /api/content/field-cards
GET /api/content/map-markers
GET /api/content/skills
GET /api/content/certificates
GET /api/content/leadership
GET /api/content/gallery
GET /api/content/contact
```

Protected write routes require an active admin session.

Hero:

```text
PATCH  /api/content/hero
POST   /api/content/hero/stats
PUT    /api/content/hero/stats/:id
DELETE /api/content/hero/stats/:id
```

About:

```text
PATCH  /api/content/about
POST   /api/content/about/details
PUT    /api/content/about/details/:id
DELETE /api/content/about/details/:id
```

Array CRUD sections:

```text
POST   /api/content/education
PUT    /api/content/education/:id
DELETE /api/content/education/:id

POST   /api/content/research
PUT    /api/content/research/:id
DELETE /api/content/research/:id

POST   /api/content/publications
PUT    /api/content/publications/:id
DELETE /api/content/publications/:id

POST   /api/content/conference
PUT    /api/content/conference/:id
DELETE /api/content/conference/:id

POST   /api/content/field-cards
PUT    /api/content/field-cards/:id
DELETE /api/content/field-cards/:id

POST   /api/content/certificates
PUT    /api/content/certificates/:id
DELETE /api/content/certificates/:id

POST   /api/content/leadership
PUT    /api/content/leadership/:id
DELETE /api/content/leadership/:id
```

Reorder routes:

```text
PATCH /api/content/education/reorder
PATCH /api/content/research/reorder
PATCH /api/content/publications/reorder
PATCH /api/content/gallery/reorder
```

Map markers:

```text
POST   /api/content/map-markers
PUT    /api/content/map-markers/:id
DELETE /api/content/map-markers/:id
```

Skills:

```text
PUT    /api/content/skills/groups/:id
POST   /api/content/skills/groups/:id/items
DELETE /api/content/skills/groups/:id/items/:itemIndex
```

Gallery:

```text
POST   /api/content/gallery/upload
PATCH  /api/content/gallery/:id
DELETE /api/content/gallery/:id
```

Portrait:

```text
POST /api/content/portrait/upload
```

Contact:

```text
PATCH  /api/content/contact
POST   /api/content/contact/items
PUT    /api/content/contact/items/:id
DELETE /api/content/contact/items/:id
```

Backup:

```text
GET /api/content/backup
```

### `server/middleware/requireAuth.js`

Protects write routes by requiring `req.session.user`.

## Environment Variables

Create a real `.env` from `.env.example` for deployment.

```text
PORT=3000
WRITER_EMAIL=your@email.com
WRITER_PASSWORD=your-strong-password
SESSION_SECRET=generate-a-long-random-string-here
NODE_ENV=production
```

Runtime defaults exist for local development, but production should always set
real values.

Important:

- Do not commit `.env`.
- Do not commit `server/data/writer-auth.json`.
- Do not commit private credentials, API keys, or tokens.
- In production, `NODE_ENV=production` makes session cookies secure, so HTTPS is
  required for login sessions.

## Running Locally

Install dependencies:

```powershell
npm install
```

Start the CMS server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000/
http://localhost:3000/admin/
```

For a static-only preview without the CMS:

```powershell
py -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Static-only mode is useful for checking the public portfolio, but `/admin/` and
CMS editing require the Node server.

## Deployment

### Static deployment

Use this for GitHub Pages or simple static hosting.

Deploy:

```text
index.html
css/
js/
images/
fonts/
README.md
```

The public page remains usable without the API because static HTML is the
fallback.

### Full CMS deployment

Use this for editing support.

Deploy the full repository to a Node-capable host, then:

1. Run `npm install`.
2. Set production environment variables.
3. Start with `npm start`.
4. Serve over HTTPS.
5. Visit `/admin/`.
6. Change the writer password from Settings after first login.
7. Use Download Backup before major edits.

### Apache fallback

`.htaccess` disables directory listing, routes `/admin/` to
`admin/index.html`, routes `/` to `index.html`, blocks `.env`, and adds basic
security headers for Apache-style hosting.

## Git Ignore Policy

Ignored files include:

```text
node_modules/
.env
server/data/content.json
server/data/writer-auth.json
public/images/portrait.jpg
public/images/gallery-*.jpg
*.log
```

The root `images/` folder is kept in the repository with `.gitkeep`, but real
uploaded images can be added later as needed.

## Maintenance Checklist

Before pushing changes:

```powershell
node --check js/main.js
node --check server/server.js
node --check server/routes/auth.js
node --check server/routes/content.js
node --check server/db/database.js
node --check server/db/writerAuth.js
```

Also verify:

- public page loads at `/`
- admin page loads at `/admin/`
- `/api/health` returns `{ "status": "ok" }`
- login works
- backup download works
- image fallbacks still show when real files are missing
- public portfolio design files are not changed unless intentionally edited

## Content Editing Workflow

Recommended editor workflow:

1. Start the Node server.
2. Log in at `/admin/`.
3. Edit one section at a time.
4. Watch the "Unsaved changes" badge.
5. Restore local autosave draft if needed.
6. Download a backup before large edits.
7. Upload optimized images.
8. Reorder education, research, publications, or gallery by dragging.
9. Open the public portfolio to verify the rendered result.
