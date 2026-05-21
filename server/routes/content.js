import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import requireAuth from '../middleware/requireAuth.js';
import { db, saveDb, publicImagesDir } from '../db/database.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function makeId() {
  return crypto.randomUUID();
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOwn(body, field) {
  return Object.prototype.hasOwnProperty.call(body, field);
}

function pick(body, fields) {
  const result = {};

  for (const field of fields) {
    if (hasOwn(body, field)) {
      result[field] = body[field];
    }
  }

  return result;
}

function missingFields(body, fields) {
  return fields.filter((field) => !hasOwn(body, field));
}

function findIndexById(items, id) {
  return items.findIndex((item) => item.id === id);
}

async function saveAndRespond(res, status, payload) {
  await saveDb();
  return res.status(status).json(payload);
}

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function notFound(res, message = 'Not found') {
  return res.status(404).json({ error: message });
}

function requireObjectBody(req, res) {
  if (!isObject(req.body)) {
    badRequest(res, 'JSON object body is required');
    return false;
  }

  return true;
}

function createArrayRoutes(routePath, dataKey) {
  router.get(routePath, (req, res) => {
    return res.status(200).json(db.data[dataKey]);
  });

  router.post(routePath, requireAuth, asyncHandler(async (req, res) => {
    if (!requireObjectBody(req, res)) return;

    const entry = {
      ...req.body,
      id: makeId()
    };

    db.data[dataKey].push(entry);
    return saveAndRespond(res, 201, entry);
  }));

  router.put(`${routePath}/:id`, requireAuth, asyncHandler(async (req, res) => {
    if (!requireObjectBody(req, res)) return;

    const items = db.data[dataKey];
    const index = findIndexById(items, req.params.id);

    if (index === -1) {
      return notFound(res);
    }

    items[index] = {
      ...req.body,
      id: req.params.id
    };

    return saveAndRespond(res, 200, items[index]);
  }));

  router.delete(`${routePath}/:id`, requireAuth, asyncHandler(async (req, res) => {
    const items = db.data[dataKey];
    const index = findIndexById(items, req.params.id);

    if (index === -1) {
      return notFound(res);
    }

    const [deleted] = items.splice(index, 1);
    return saveAndRespond(res, 200, { deleted: true, id: deleted.id });
  }));
}

function createChildRoutes(routePath, itemsGetter, requiredFields, allowedFields) {
  router.post(routePath, requireAuth, asyncHandler(async (req, res) => {
    if (!requireObjectBody(req, res)) return;

    const missing = missingFields(req.body, requiredFields);

    if (missing.length > 0) {
      return badRequest(res, `Missing required fields: ${missing.join(', ')}`);
    }

    const entry = {
      id: makeId(),
      ...pick(req.body, allowedFields)
    };

    itemsGetter().push(entry);
    return saveAndRespond(res, 201, entry);
  }));

  router.put(`${routePath}/:id`, requireAuth, asyncHandler(async (req, res) => {
    if (!requireObjectBody(req, res)) return;

    const items = itemsGetter();
    const index = findIndexById(items, req.params.id);

    if (index === -1) {
      return notFound(res);
    }

    items[index] = {
      ...items[index],
      ...pick(req.body, allowedFields),
      id: req.params.id
    };

    return saveAndRespond(res, 200, items[index]);
  }));

  router.delete(`${routePath}/:id`, requireAuth, asyncHandler(async (req, res) => {
    const items = itemsGetter();
    const index = findIndexById(items, req.params.id);

    if (index === -1) {
      return notFound(res);
    }

    const [deleted] = items.splice(index, 1);
    return saveAndRespond(res, 200, { deleted: true, id: deleted.id });
  }));
}

router.get('/hero', (req, res) => {
  return res.status(200).json(db.data.hero);
});

router.patch('/hero', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  Object.assign(db.data.hero, pick(req.body, ['eyebrow', 'tagline']));
  return saveAndRespond(res, 200, db.data.hero);
}));

createChildRoutes(
  '/hero/stats',
  () => db.data.hero.stats,
  ['num', 'label'],
  ['num', 'label']
);

router.get('/about', (req, res) => {
  return res.status(200).json(db.data.about);
});

router.patch('/about', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  if (hasOwn(req.body, 'bio_paragraphs') && !Array.isArray(req.body.bio_paragraphs)) {
    return badRequest(res, 'bio_paragraphs must be an array');
  }

  Object.assign(db.data.about, pick(req.body, ['bio_paragraphs']));
  return saveAndRespond(res, 200, db.data.about);
}));

createChildRoutes(
  '/about/details',
  () => db.data.about.details,
  ['label', 'value'],
  ['label', 'value']
);

createArrayRoutes('/education', 'education');
createArrayRoutes('/research', 'research');
createArrayRoutes('/publications', 'publications');
createArrayRoutes('/conference', 'conference');
createArrayRoutes('/field-cards', 'field_cards');

router.get('/map-markers', (req, res) => {
  return res.status(200).json(db.data.map_markers);
});

router.post('/map-markers', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  const missing = missingFields(req.body, ['lat', 'lng', 'title', 'desc']);

  if (missing.length > 0) {
    return badRequest(res, `Missing required fields: ${missing.join(', ')}`);
  }

  const lat = Number(req.body.lat);
  const lng = Number(req.body.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return badRequest(res, 'lat and lng must be valid numbers');
  }

  const marker = {
    id: makeId(),
    lat,
    lng,
    title: req.body.title,
    desc: req.body.desc
  };

  db.data.map_markers.push(marker);
  return saveAndRespond(res, 201, marker);
}));

router.put('/map-markers/:id', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  const index = findIndexById(db.data.map_markers, req.params.id);

  if (index === -1) {
    return notFound(res);
  }

  const updates = pick(req.body, ['lat', 'lng', 'title', 'desc']);

  if (hasOwn(updates, 'lat')) {
    updates.lat = Number(updates.lat);
  }

  if (hasOwn(updates, 'lng')) {
    updates.lng = Number(updates.lng);
  }

  if ((hasOwn(updates, 'lat') && !Number.isFinite(updates.lat)) ||
      (hasOwn(updates, 'lng') && !Number.isFinite(updates.lng))) {
    return badRequest(res, 'lat and lng must be valid numbers');
  }

  db.data.map_markers[index] = {
    ...db.data.map_markers[index],
    ...updates,
    id: req.params.id
  };

  return saveAndRespond(res, 200, db.data.map_markers[index]);
}));

router.delete('/map-markers/:id', requireAuth, asyncHandler(async (req, res) => {
  const index = findIndexById(db.data.map_markers, req.params.id);

  if (index === -1) {
    return notFound(res);
  }

  const [deleted] = db.data.map_markers.splice(index, 1);
  return saveAndRespond(res, 200, { deleted: true, id: deleted.id });
}));

router.get('/skills', (req, res) => {
  return res.status(200).json(db.data.skills);
});

router.put('/skills/groups/:id', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  const group = db.data.skills.groups.find((item) => item.id === req.params.id);

  if (!group) {
    return notFound(res);
  }

  Object.assign(group, pick(req.body, ['heading', 'icon']));
  return saveAndRespond(res, 200, group);
}));

router.post('/skills/groups/:id/items', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  if (!hasOwn(req.body, 'text')) {
    return badRequest(res, 'Missing required fields: text');
  }

  const group = db.data.skills.groups.find((item) => item.id === req.params.id);

  if (!group) {
    return notFound(res);
  }

  if (!Array.isArray(group.items)) {
    group.items = [];
  }

  group.items.push(req.body.text);
  return saveAndRespond(res, 201, {
    text: req.body.text,
    itemIndex: group.items.length - 1
  });
}));

router.delete('/skills/groups/:id/items/:itemIndex', requireAuth, asyncHandler(async (req, res) => {
  const group = db.data.skills.groups.find((item) => item.id === req.params.id);

  if (!group) {
    return notFound(res);
  }

  const itemIndex = Number(req.params.itemIndex);

  if (!Number.isInteger(itemIndex)) {
    return badRequest(res, 'itemIndex must be an integer');
  }

  if (!Array.isArray(group.items) || itemIndex < 0 || itemIndex >= group.items.length) {
    return notFound(res);
  }

  group.items.splice(itemIndex, 1);
  return saveAndRespond(res, 200, { deleted: true, itemIndex });
}));

createArrayRoutes('/certificates', 'certificates');
createArrayRoutes('/leadership', 'leadership');

router.get('/gallery', (req, res) => {
  return res.status(200).json(db.data.gallery);
});

router.post('/gallery/upload', requireAuth, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return badRequest(res, 'image file is required');
  }

  const id = makeId();
  const filename = `gallery-${id}.jpg`;
  const filePath = path.join(publicImagesDir, filename);

  await fs.mkdir(publicImagesDir, { recursive: true });
  await fs.writeFile(filePath, req.file.buffer);

  const entry = {
    id,
    filename,
    caption: req.body && req.body.caption ? req.body.caption : ''
  };

  db.data.gallery.push(entry);

  return saveAndRespond(res, 201, {
    ...entry,
    url: `/images/${filename}`
  });
}));

router.patch('/gallery/:id', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  const item = db.data.gallery.find((entry) => entry.id === req.params.id);

  if (!item) {
    return notFound(res);
  }

  Object.assign(item, pick(req.body, ['caption']));
  return saveAndRespond(res, 200, item);
}));

router.delete('/gallery/:id', requireAuth, asyncHandler(async (req, res) => {
  const index = findIndexById(db.data.gallery, req.params.id);

  if (index === -1) {
    return notFound(res);
  }

  const entry = db.data.gallery[index];
  const imagePath = path.join(publicImagesDir, path.basename(entry.filename));

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  db.data.gallery.splice(index, 1);
  return saveAndRespond(res, 200, { deleted: true, id: entry.id });
}));

router.post('/portrait/upload', requireAuth, upload.single('portrait'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return badRequest(res, 'portrait file is required');
  }

  await fs.mkdir(publicImagesDir, { recursive: true });
  await fs.writeFile(path.join(publicImagesDir, 'portrait.jpg'), req.file.buffer);

  return res.status(200).json({ url: '/images/portrait.jpg' });
}));

router.get('/contact', (req, res) => {
  return res.status(200).json(db.data.contact);
});

router.patch('/contact', requireAuth, asyncHandler(async (req, res) => {
  if (!requireObjectBody(req, res)) return;

  Object.assign(db.data.contact, pick(req.body, ['title', 'subtitle']));
  return saveAndRespond(res, 200, db.data.contact);
}));

createChildRoutes(
  '/contact/items',
  () => db.data.contact.items,
  ['icon', 'label', 'value', 'url'],
  ['icon', 'label', 'value', 'url']
);

export default router;
