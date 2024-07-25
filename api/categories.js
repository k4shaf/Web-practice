import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const filePath = join(process.cwd(), 'public', 'album.html');
  const fileContent = readFileSync(filePath, 'utf8');
  res.status(200).send(fileContent);
}
