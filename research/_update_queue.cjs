const fs = require('fs');
const path = require('path');

const queuePath = path.join(process.env.HOME, 'projects/aicopyrightlegal/research/_queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

for (let task of queue.tasks) {
  if (task.id === 'task-004') {
    task.status = 'completed';
  }
}

queue.tasks.push({
  id: `task-${String(queue.tasks.length + 1).padStart(3, '0')}`,
  created: new Date().toISOString(),
  from: "writer",
  for: "site-owner",
  priority: "high",
  status: "pending",
  task: "New article published as draft: How to Protect Your Content From AI Scraping in 2026 (Technical & Legal Guide). Slug: protect-content-from-ai-scraping-2026. Monitor indexing after it goes live.",
  output_to: null
});

fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
