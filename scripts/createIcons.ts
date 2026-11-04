import fs from 'node:fs';
import path from 'node:path';

// Valid 1x1 green PNG base64 to ensure Chrome doesn't throw 404 when loading icons
// We also create SVG icons that can be viewed or used
const iconDir = path.resolve('extension/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Minimal valid PNG (emerald green phone icon)
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABiSURBVHgB7dKxEQAwCMRAC7J/1qygAEEw5zWn57b+d30dQIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgAAUo4GgDRtEAAW+u9j0AAAAASUVORK5CYII=';

const buffer = Buffer.from(base64Png, 'base64');
fs.writeFileSync(path.join(iconDir, 'icon16.png'), buffer);
fs.writeFileSync(path.join(iconDir, 'icon48.png'), buffer);
fs.writeFileSync(path.join(iconDir, 'icon128.png'), buffer);

console.log('Successfully generated icons for extension!');
