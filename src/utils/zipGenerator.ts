/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tạo và tải xuống tệp ZIP tiện ích Chrome Extension trọn gói
 */

import JSZip from 'jszip';
import { EXTENSION_FILES } from '../data/extensionFiles';

export async function downloadExtensionZip(onProgress?: (progress: number) => void): Promise<void> {
  const zip = new JSZip();

  // Thư mục gốc cho tiện ích mở rộng
  const folder = zip.folder('leadhunter-extension-v3');
  if (!folder) throw new Error('Không thể tạo thư mục ZIP');

  // Thêm tất cả các tệp mã nguồn vào ZIP
  for (const file of EXTENSION_FILES) {
    folder.file(file.path, file.code);
  }

  // Thêm icon tối thiểu để Chrome load unpacked hợp lệ
  const iconsFolder = folder.folder('icons');
  if (iconsFolder) {
    const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABiSURBVHgB7dKxEQAwCMRAC7J/1qygAEEw5zWn57b+d30dQIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgAAUoQAEKUIACFKAABShAAQpQgAIUoAAFKEABClCAAhSgAAUo4GgDRtEAAW+u9j0AAAAASUVORK5CYII=';
    iconsFolder.file('icon16.png', base64Png, { base64: true });
    iconsFolder.file('icon48.png', base64Png, { base64: true });
    iconsFolder.file('icon128.png', base64Png, { base64: true });
  }

  // Thêm tệp README hướng dẫn cài đặt nhanh
  folder.file('README_HUONG_DAN_CAI_DAT.txt', 
`=== HƯỚNG DẪN CÀI ĐẶT LEADHUNTER VN CHROME EXTENSION (MANIFEST V3) ===

Bước 1: Giải nén thư mục này vào máy tính của bạn (ví dụ: C:\\leadhunter-extension hoặc ~/leadhunter-extension).

Bước 2: Mở trình duyệt Google Chrome hoặc Microsoft Edge, Cốc Cốc, Brave.
        Truy cập thanh địa chỉ: chrome://extensions/

Bước 3: Bật công tắc "Chế độ dành cho nhà phát triển" (Developer mode) ở góc trên bên phải.

Bước 4: Nhấp vào nút "Tải tiện ích đã giải nén" (Load unpacked) ở góc trên bên trái.

Bước 5: Chọn thư mục đã giải nén có chứa tệp 'manifest.json'.

Hoàn tất! Biểu tượng LeadHunter VN sẽ xuất hiện trên thanh tiện ích của trình duyệt.
Chúc bạn quét lead và bùng nổ doanh số!
`);

  // Tạo Blob ZIP
  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) onProgress(metadata.percent);
  });

  // Tải về máy người dùng
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LeadHunter-VN-Chrome-Extension-MV3.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
