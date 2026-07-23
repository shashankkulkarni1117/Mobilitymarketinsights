import fs from "node:fs";
const month = process.argv[2] || new Date().toISOString().slice(0,7);
const news = JSON.parse(fs.readFileSync("data/news.json","utf8"));
console.table(news.filter(x => x.month === month && x.approved !== false)
  .map(x => ({country:x.country,category:x.category,date:x.date,source:x.source})));
