/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Search,
  Copy,
  Check,
  Send,
  MessageCircle,
  PhoneCall,
  Sliders,
  FileSpreadsheet,
  Globe,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Share2,
  UserCheck,
  Facebook,
  ExternalLink,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { AppSettings } from '../types';
import { lookupPhoneByFbUid, FbUserLead } from '../utils/fbExtractor';
import { formatPhoneDisplay } from '../utils/phoneExtractor';

interface ExtensionSimulatorProps {
  settings: AppSettings;
  onSendToCrm: (payload: any) => void;
  onOpenOptions: () => void;
}

interface FbMockUser {
  id: string;
  name: string;
  uid: string;
  profileUrl: string;
  avatarBg: string;
  avatarText: string;
  initialRole: string;
}

interface FbPost {
  id: string;
  author: FbMockUser;
  timeAgo: string;
  groupName?: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: {
    id: string;
    author: FbMockUser;
    content: string;
    timeAgo: string;
  }[];
}

const INITIAL_FB_POSTS: FbPost[] = [
  {
    id: 'post_1',
    author: {
      id: 'user_an',
      name: 'Nguyễn Văn An',
      uid: '100088992211001',
      profileUrl: 'https://facebook.com/nguyen.van.an',
      avatarBg: 'bg-emerald-600',
      avatarText: 'AN',
      initialRole: 'Tác giả bài viết',
    },
    timeAgo: '15 phút trước',
    groupName: 'Hội Mua Bán & Cho Thuê Bất Động Sản Hà Nội (125.000 thành viên)',
    content: `[CHÍNH CHỦ CẦN BÁN GẤP]
Căn hộ 2PN 2WC tại Vinhomes Smart City Tây Mỗ, view thoáng mát, đầy đủ nội thất cao cấp.
- Diện tích: 64m2 thông thủy.
- Giá công khai: 3.25 tỷ (Có thương lượng trực tiếp cho khách thiện chí giao dịch trong tuần).
- Sổ hồng chính chủ sẵn sàng công chứng sang tên ngay.
Bác nào quan tâm bình luận hoặc inbox em gửi video và định vị xem nhà trực tiếp nhé!`,
    likes: 42,
    commentsCount: 3,
    comments: [
      {
        id: 'c_1',
        author: {
          id: 'user_mai',
          name: 'Trần Thị Mai',
          uid: '100077883344002',
          profileUrl: 'https://facebook.com/tran.thi.mai',
          avatarBg: 'bg-rose-500',
          avatarText: 'MA',
          initialRole: 'Khách hàng quan tâm',
        },
        content: 'Căn này tầng bao nhiêu vậy anh? Inbox em xin thông tin chi tiết và hướng ban công nhé!',
        timeAgo: '12 phút trước',
      },
      {
        id: 'c_2',
        author: {
          id: 'user_quan',
          name: 'Lê Hoàng Quân',
          uid: '100066554433003',
          profileUrl: 'https://facebook.com/le.hoang.quan',
          avatarBg: 'bg-blue-600',
          avatarText: 'QU',
          initialRole: 'Môi giới / Nhà đầu tư',
        },
        content: 'Giá này có bao phí sang tên trọn gói không bạn ơi? Có khách muốn xem trong chiều nay luôn.',
        timeAgo: '8 phút trước',
      },
      {
        id: 'c_3',
        author: {
          id: 'user_linh',
          name: 'Hoàng Thảo Linh',
          uid: '100055443322004',
          profileUrl: 'https://facebook.com/hoang.thao.linh',
          avatarBg: 'bg-purple-600',
          avatarText: 'LI',
          initialRole: 'Khách hàng',
        },
        content: 'Đã kết bạn với anh rồi ạ, check inbox giúp em với nhé!',
        timeAgo: '3 phút trước',
      },
    ],
  },
  {
    id: 'post_2',
    author: {
      id: 'user_tuan',
      name: 'Phạm Minh Tuấn',
      uid: '100033221100006',
      profileUrl: 'https://facebook.com/pham.minh.tuan',
      avatarBg: 'bg-amber-600',
      avatarText: 'TU',
      initialRole: 'Đại lý phân phối sỉ',
    },
    timeAgo: '1 giờ trước',
    groupName: 'Cộng Đồng Bán Hàng Online & Tìm Nguồn Hàng Giá Gốc',
    content: `🔥 TỔNG KHO PHỤ KIỆN & THIẾT BỊ THÔNG MINH TUYỂN ĐẠI LÝ / CTV TOÀN QUỐC 🔥
- Chính sách chiết khấu lên đến 45%, hỗ trợ đổi trả nếu không bán được.
- Đào tạo cách chạy quảng cáo thực chiến và tặng sẵn kịch bản chốt đơn tự động.
- Nguồn hàng sẵn kho Hà Nội và TP.HCM, giao hỏa tốc trong ngày.
Các bác để lại bình luận để bộ phận kinh doanh liên hệ gửi bảng giá sỉ nhé!`,
    likes: 89,
    commentsCount: 1,
    comments: [
      {
        id: 'c_4',
        author: {
          id: 'user_huong',
          name: 'Đỗ Thu Hương',
          uid: '100022110099007',
          profileUrl: 'https://facebook.com/do.thu.huong',
          avatarBg: 'bg-teal-600',
          avatarText: 'HU',
          initialRole: 'Chủ shop thời trang',
        },
        content: 'Cho em xin chính sách đại lý và bảng báo giá chi tiết qua Zalo nhé shop!',
        timeAgo: '20 phút trước',
      },
    ],
  },
];

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  settings,
  onSendToCrm,
  onOpenOptions,
}) => {
  // Trạng thái tra cứu SĐT của từng user: key = uid
  const [revealedUsers, setRevealedUsers] = useState<Record<string, FbUserLead>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [activeActionsUid, setActiveActionsUid] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [crmSuccessUid, setCrmSuccessUid] = useState<string | null>(null);

  // Danh sách các số đã lấy được để hiển thị trên Popup Extension
  const collectedLeadsList = useMemo(() => {
    return Object.values(revealedUsers).filter((u) => u.phone && u.status === 'found');
  }, [revealedUsers]);

  // Click vào nút [📞 Lấy SĐT] cạnh tên Facebook
  const handleLookupClick = (user: FbMockUser) => {
    // Nếu đã lấy rồi thì chỉ cần bật/tắt popover hành động
    if (revealedUsers[user.uid]?.status === 'found') {
      setActiveActionsUid(activeActionsUid === user.uid ? null : user.uid);
      return;
    }

    // Set trạng thái đang tải (Loading spinner)
    setLoadingUsers((prev) => ({ ...prev, [user.uid]: true }));

    // Mô phỏng Service Worker gọi API tra cứu UID -> SĐT
    setTimeout(() => {
      const result = lookupPhoneByFbUid(user.uid);
      setLoadingUsers((prev) => ({ ...prev, [user.uid]: false }));

      if (result) {
        setRevealedUsers((prev) => ({
          ...prev,
          [user.uid]: {
            uid: user.uid,
            name: user.name,
            profileUrl: user.profileUrl,
            phone: result.phone,
            rawPhone: result.phone,
            carrier: result.carrier,
            e164: result.e164,
            status: 'found',
            timestamp: Date.now(),
          },
        }));
        // Mở popover hành động ngay lập tức
        setActiveActionsUid(user.uid);
      } else {
        setRevealedUsers((prev) => ({
          ...prev,
          [user.uid]: {
            uid: user.uid,
            name: user.name,
            profileUrl: user.profileUrl,
            status: 'not_found',
            errorMessage: 'Không tìm thấy số điện thoại công khai cho UID này',
          },
        }));
      }
    }, 450);
  };

  const handleCopy = (lead: FbUserLead) => {
    if (!lead.phone) return;
    navigator.clipboard.writeText(lead.phone);
    setCopiedUid(lead.uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handlePushToCrm = (lead: FbUserLead) => {
    if (!lead.phone) return;
    const payload = {
      leadId: `lead_fb_${lead.uid}`,
      name: lead.name,
      uid: lead.uid,
      phone: lead.phone,
      rawPhone: lead.rawPhone || lead.phone,
      carrier: lead.carrier,
      e164: lead.e164,
      sourceUrl: lead.profileUrl,
      pageTitle: `Facebook Lead: ${lead.name}`,
      affiliateId: settings.affiliateId || '',
      timestamp: new Date().toISOString(),
      extensionVersion: '1.1.0',
    };
    onSendToCrm(payload);
    setCrmSuccessUid(lead.uid);
    setTimeout(() => setCrmSuccessUid(null), 2500);
  };

  const handleExportCsv = () => {
    if (collectedLeadsList.length === 0) return;
    const headers = ['STT', 'Họ Tên Facebook', 'Facebook UID', 'Profile URL', 'Số Điện Thoại', 'Định Dạng E.164', 'Nhà Mạng', 'Affiliate ID', 'Thời Gian'];
    const rows = collectedLeadsList.map((l, idx) => [
      idx + 1,
      `"${l.name}"`,
      `"${l.uid}"`,
      `"${l.profileUrl}"`,
      `"${l.phone}"`,
      `"${l.e164 || ''}"`,
      `"${l.carrier || ''}"`,
      `"${settings.affiliateId || ''}"`,
      `"${new Date(l.timestamp || Date.now()).toLocaleString('vi-VN')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LeadHunter_Facebook_Leads_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Component nút hiển thị SĐT gắn ngay cạnh tên người dùng Facebook
   */
  const RenderFbNamePhoneButton = ({ user }: { user: FbMockUser }) => {
    const isRevealed = revealedUsers[user.uid]?.status === 'found';
    const isNotFound = revealedUsers[user.uid]?.status === 'not_found';
    const isLoading = loadingUsers[user.uid];
    const leadData = revealedUsers[user.uid];
    const isActionOpen = activeActionsUid === user.uid;

    const affiliateParam = settings.affiliateId ? `?ref=${encodeURIComponent(settings.affiliateId)}` : '';
    const zaloUrl = leadData?.phone ? `https://zalo.me/${leadData.phone}${affiliateParam}` : '#';

    return (
      <span className="relative inline-flex items-center align-middle ml-1.5 z-20">
        {isRevealed && leadData?.phone ? (
          /* Nút đã ra số điện thoại (Vibrant Pill) */
          <button
            onClick={() => setActiveActionsUid(isActionOpen ? null : user.uid)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-white text-emerald-800 border-1.5 border-emerald-500 shadow-sm hover:bg-emerald-50 transition-all cursor-pointer"
            title="Nhấp để mở thao tác Zalo / Sao chép / CRM"
          >
            <PhoneCall className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span className="font-mono tracking-tight">{formatPhoneDisplay(leadData.phone)}</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {leadData.carrier}
            </span>
          </button>
        ) : (
          /* Nút ban đầu [📞 Lấy SĐT] cạnh tên */
          <button
            onClick={() => handleLookupClick(user)}
            disabled={isLoading}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm transition-all duration-150 cursor-pointer ${
              isNotFound
                ? 'bg-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:scale-105 active:scale-95 shadow-emerald-500/20'
            }`}
            title={`Nhấp để lấy số điện thoại của ${user.name}`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Đang lấy...</span>
              </>
            ) : isNotFound ? (
              <span>Không có SĐT</span>
            ) : (
              <>
                <PhoneCall className="w-2.5 h-2.5 text-white fill-white" />
                <span>Lấy SĐT</span>
              </>
            )}
          </button>
        )}

        {/* Floating Quick Action Popover khi bấm vào số điện thoại */}
        {isActionOpen && leadData && (
          <div className="absolute top-full left-0 mt-2 z-50 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 bg-white">
              <span className="font-bold text-slate-900 truncate max-w-[130px]">{user.name}</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {leadData.carrier}
              </span>
            </div>

            <div className="space-y-1.5 bg-white">
              <button
                onClick={() => handleCopy(leadData)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {copiedUid === user.uid ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  {copiedUid === user.uid ? 'Đã sao chép!' : 'Sao chép SĐT'}
                </span>
                <span className="font-mono text-[11px] text-slate-500 font-bold">{leadData.phone}</span>
              </button>

              <button
                onClick={() => handlePushToCrm(leadData)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {crmSuccessUid === user.uid ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {crmSuccessUid === user.uid ? 'Đã đẩy vào CRM!' : 'Đẩy vào CRM'}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">POST</span>
              </button>

              {settings.enableZalo && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-600" /> Nhắn Zalo
                  </span>
                  {settings.affiliateId && (
                    <span className="text-[9px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-mono">Ref ID</span>
                  )}
                </a>
              )}

              <a
                href={`tel:${leadData.phone}`}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" /> Gọi điện ngay
                </span>
                <span className="text-[10px] text-slate-400 font-mono">tel:</span>
              </a>
            </div>
          </div>
        )}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode Explanation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 border border-blue-800/60 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-md">
              <Facebook className="w-4 h-4 fill-white" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Tiện Ích Tự Động Gắn Icon Số Điện Thoại Cạnh Tên Người Dùng Facebook
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Đúng theo yêu cầu của bạn: Khi người dùng lướt Facebook (Bảng tin, Bài đăng nhóm, Bình luận, Danh sách thành viên),
            tiện ích tự động nhận diện Profile/UID và gắn ngay nút <strong className="text-emerald-400">[📞 Lấy SĐT]</strong> cạnh tên.
            Chỉ cần bấm là hiện ra số điện thoại ngay lập tức!
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-300">Đã lấy:</span>
          <strong className="text-emerald-400 font-mono text-sm">{collectedLeadsList.length} SĐT</strong>
        </div>
      </div>

      {/* Chrome Browser Simulation Frame */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Top Window Bar */}
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs text-slate-400 font-medium ml-2 hidden sm:inline">
              Facebook - Hội Bất Động Sản Hà Nội | Google Chrome
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
            Facebook Injector Active
          </span>
        </div>

        {/* Chrome Address Bar & Toolbar */}
        <div className="bg-slate-900 px-3 sm:px-4 py-2 flex items-center space-x-3 border-b border-slate-800">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <button className="p-1 hover:text-white rounded hover:bg-slate-800" title="Back">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="p-1 hover:text-white rounded hover:bg-slate-800" title="Forward">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setRevealedUsers({});
                setActiveActionsUid(null);
              }}
              className="p-1 hover:text-white rounded hover:bg-slate-800"
              title="Tải lại trang"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Facebook Omnibox */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-blue-400 font-mono">https://</span>
            <span className="font-mono text-slate-200">facebook.com/groups/bds-hanoi-chinh-chu</span>
          </div>

          {/* Extension Icon with Dynamic Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <button
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              className="relative p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
              title="LeadHunter VN: Click để mở Popup"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5 text-white" />
              </div>

              {collectedLeadsList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {collectedLeadsList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Facebook Content Area & Extension Popup Split View */}
        <div className="relative bg-[#f0f2f5] min-h-[620px] p-3 sm:p-5 flex flex-col lg:flex-row gap-5">
          {/* Main Facebook UI Stream */}
          <div className="flex-1 space-y-4 max-w-3xl">
            {/* Facebook Navigation Simulation Bar */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  f
                </div>
                <div className="bg-[#f0f2f5] rounded-full px-3 py-1.5 flex items-center space-x-2 text-xs text-slate-500 w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5" />
                  <span>Tìm kiếm trên Facebook...</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-600 hidden sm:flex items-center space-x-4">
                <span className="text-blue-600 border-b-2 border-blue-600 py-1">Trang chủ</span>
                <span>Bạn bè</span>
                <span>Nhóm</span>
              </div>
            </div>

            {/* Facebook Posts with Injected Phone Buttons */}
            {INITIAL_FB_POSTS.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full ${post.author.avatarBg} text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs`}
                    >
                      {post.author.avatarText}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Tên người dùng + Nút Lấy SĐT được tự động chèn ngay bên cạnh */}
                      <div className="flex flex-wrap items-center">
                        <span className="font-bold text-slate-900 text-sm hover:underline cursor-pointer">
                          {post.author.name}
                        </span>

                        {/* NÚT THẦN THÁNH: CHÈN NGAY CẠNH TÊN NGƯỜI DÙNG */}
                        <RenderFbNamePhoneButton user={post.author} />
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <span>{post.timeAgo}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600 truncate">{post.groupName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Text */}
                  <p className="mt-3 text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                    {post.content}
                  </p>
                </div>

                {/* Post Reaction Bar */}
                <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">👍</span>
                    <span>{post.likes}</span>
                  </span>
                  <span>{post.commentsCount} bình luận</span>
                </div>

                <div className="px-4 py-1.5 border-b border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-600">
                  <button className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 rounded-md">
                    <ThumbsUp className="w-3.5 h-3.5" /> Thích
                  </button>
                  <button className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 rounded-md text-blue-600">
                    <MessageSquare className="w-3.5 h-3.5" /> Bình luận
                  </button>
                  <button className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 rounded-md">
                    <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                  </button>
                </div>

                {/* Facebook Comments Section: Each commenter gets a phone button next to name */}
                <div className="p-4 bg-slate-50/60 space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Bình luận nổi bật (Extension tự động gắn nút cho từng người):
                  </span>

                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${comment.author.avatarBg} text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 shadow-2xs mt-0.5`}
                      >
                        {comment.author.avatarText}
                      </div>

                      <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs">
                        <div className="flex flex-wrap items-center">
                          <span className="font-bold text-slate-900 text-xs hover:underline cursor-pointer">
                            {comment.author.name}
                          </span>

                          {/* NÚT THẦN THÁNH CẠNH TÊN NGƯỜI BÌNH LUẬN */}
                          <RenderFbNamePhoneButton user={comment.author} />
                        </div>

                        <p className="text-xs text-slate-700 mt-1 leading-snug">{comment.content}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">{comment.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Extension Popup Panel (Top-Right like Real Chrome Extension) */}
          <div
            className={`w-full lg:w-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transition-all duration-200 flex flex-col h-fit sticky top-4 ${
              isPopupOpen ? 'opacity-100 scale-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            {/* Popup Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">LeadHunter VN</h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"></span>
                    <span className="text-[10px] text-slate-500 font-medium">Facebook UID Engine On</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenOptions}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cài đặt Options"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Popup Summary Card */}
            <div className="bg-slate-50 m-3 p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {collectedLeadsList.length}
                  </span>
                  <span className="text-xs text-slate-500 ml-2 font-medium">SĐT Facebook đã lấy</span>
                </div>
                <button
                  onClick={() => {
                    setRevealedUsers({});
                    setActiveActionsUid(null);
                  }}
                  className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-100 text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Làm mới
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-1">
                Lướt đến đâu, bấm vào nút cạnh tên người dùng để hiển thị SĐT và lưu vào danh sách tại đây.
              </p>
            </div>

            {/* Popup Action Toolbar */}
            <div className="px-3 pb-2 flex gap-2">
              <button
                onClick={handleExportCsv}
                disabled={collectedLeadsList.length === 0}
                className="flex-1 py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất CSV ({collectedLeadsList.length})</span>
              </button>

              <button
                onClick={() => {
                  collectedLeadsList.forEach((lead, i) => {
                    setTimeout(() => handlePushToCrm(lead), i * 150);
                  });
                }}
                disabled={collectedLeadsList.length === 0}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đẩy tất cả CRM</span>
              </button>
            </div>

            {/* Collected Leads List */}
            <div className="px-3 flex-1 overflow-y-auto max-h-[300px] space-y-2 py-1">
              {collectedLeadsList.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Chưa lấy số điện thoại nào</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
                    Hãy bấm vào nút <strong className="text-emerald-600">[📞 Lấy SĐT]</strong> cạnh tên của bất kỳ người dùng Facebook nào ở bảng tin bên trái!
                  </p>
                </div>
              ) : (
                collectedLeadsList.map((lead) => {
                  const affiliateParam = settings.affiliateId ? `?ref=${encodeURIComponent(settings.affiliateId)}` : '';
                  const zaloUrl = `https://zalo.me/${lead.phone}${affiliateParam}`;

                  return (
                    <div
                      key={lead.uid}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                          {lead.name}
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                          {formatPhoneDisplay(lead.phone || '')}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {lead.carrier} • UID: {lead.uid.slice(-6)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleCopy(lead)}
                          className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-2xs cursor-pointer"
                          title="Sao chép SĐT"
                        >
                          {copiedUid === lead.uid ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handlePushToCrm(lead)}
                          className="w-7 h-7 rounded-md bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center shadow-2xs cursor-pointer"
                          title="Đẩy vào CRM"
                        >
                          {crmSuccessUid === lead.uid ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {settings.enableZalo && (
                          <a
                            href={zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-md bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Nhắn Zalo"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Popup Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
              <span>LeadHunter Extension v1.1.0</span>
              <span className="font-mono">facebook.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
