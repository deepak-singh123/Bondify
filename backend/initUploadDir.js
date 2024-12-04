import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = new URL('../public/uploads/profiles', import.meta.url);

try {
    await mkdir(uploadDir, { recursive: true });
    console.log('Upload directory created successfully!');
} catch (error) {
    console.error('Error creating directory:', error);
}
