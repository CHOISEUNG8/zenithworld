"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Truck,
  TrendingUp,
  Megaphone,
  MessageCircle,
  Settings,
  Bell,
  Plus,
  Eye,
  Edit,
  Download,
  ChevronDown,
  Menu,
  X,
  Search,
  Filter,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Trash2,
  Key,
  UserPlus,
  AlertCircle,
} from "lucide-react"

const theme = {
  primary: "#ff8c00",
  primaryLight: "#ffedd5",
  primaryDark: "#ea580c",
  accent: "#C5D3E8",
  accentDark: "#9CA3AF",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}

// 권한 그룹 정의
const permissionGroups = {
  Admin: {
    name: "최고관리자",
    description: "모든 기능 접근, 설정 변경 가능",
    note: "대표자/총괄",
    color: theme.error,
    level: 1,
  },
  Product: {
    name: "상품 관리자",
    description: "상품 등록/수정, 카테고리 관리",
    note: "개발자 또는 MD",
    color: theme.primary,
    level: 2,
  },
  Order: {
    name: "주문 관리자",
    description: "주문 처리, 송장 등록, 교환/환불 승인",
    note: "CS팀 운영자",
    color: theme.success,
    level: 3,
  },
  Member: {
    name: "회원 관리자",
    description: "회원 등급 관리, 포인트/쿠폰 지급",
    note: "CRM/마케팅 담당",
    color: theme.accent,
    level: 4,
  },
  Marketing: {
    name: "마케팅 관리자",
    description: "이벤트, 기획전, 배너 설정",
    note: "프로모션 기획자",
    color: theme.warning,
    level: 5,
  },
  Analytics: {
    name: "통계 조회 전용",
    description: "통계 데이터 조회만 가능",
    note: "외부 분석팀/간접 접근",
    color: theme.textMuted,
    level: 6,
  },
  Support: {
    name: "고객센터 담당자",
    description: "1:1 문의, 후기, Q&A 응대",
    note: "CS 직원 전용",
    color: theme.accentDark,
    level: 7,
  },
}

// 기능별 권한 매트릭스
const permissionMatrix = {
  "상품 등록/수정": ["Admin", "Product"],
  "주문 상태 변경": ["Admin", "Order"],
  "회원 포인트 관리": ["Admin", "Member"],
  "쿠폰 등록/발급": ["Admin", "Member", "Marketing"],
  "기획전/배너 설정": ["Admin", "Marketing"],
  "1:1 문의 응답": ["Admin", "Support"],
  "통계 조회": ["Admin", "Analytics", "Marketing", "Member"],
  "관리자 설정": ["Admin"],
  "배송 설정": ["Admin", "Order"],
  "카테고리 관리": ["Admin", "Product"],
}

const menuItems = [
  {
    id: "dashboard",
    name: "대시보드",
    icon: BarChart3,
    requiredPermission: [],
    items: [
      { name: "매출 요약", path: "/dashboard/sales", permission: ["Admin", "Analytics"] },
      { name: "주문 현황", path: "/dashboard/orders", permission: ["Admin", "Order", "Analytics"] },
      { name: "인기 상품", path: "/dashboard/products", permission: ["Admin", "Product", "Analytics"] },
      { name: "신규회원", path: "/dashboard/members", permission: ["Admin", "Member", "Analytics"] },
    ],
  },
  {
    id: "products",
    name: "상품관리",
    icon: Package,
    requiredPermission: ["Admin", "Product"],
    items: [
      { name: "상품 목록", path: "/products", permission: ["Admin", "Product"] },
      { name: "상품 등록/수정", path: "/products/edit", permission: ["Admin", "Product"] },
      { name: "옵션/재고 관리", path: "/products/inventory", permission: ["Admin", "Product"] },
      { name: "카테고리 관리", path: "/products/categories", permission: ["Admin", "Product"] },
      { name: "진열/태그 관리", path: "/products/display", permission: ["Admin", "Product"] },
    ],
  },
  {
    id: "orders",
    name: "주문관리",
    icon: ShoppingCart,
    requiredPermission: ["Admin", "Order"],
    items: [
      { name: "전체 주문 조회", path: "/orders", permission: ["Admin", "Order"] },
      { name: "주문 상태 변경", path: "/orders/status", permission: ["Admin", "Order"] },
      { name: "송장번호 등록", path: "/orders/tracking", permission: ["Admin", "Order"] },
      { name: "반품/교환/환불", path: "/orders/returns", permission: ["Admin", "Order"] },
      { name: "CS 메모 관리", path: "/orders/notes", permission: ["Admin", "Order", "Support"] },
    ],
  },
  {
    id: "members",
    name: "회원관리",
    icon: Users,
    requiredPermission: ["Admin", "Member"],
    items: [
      { name: "회원 목록/검색", path: "/members", permission: ["Admin", "Member"] },
      { name: "회원 상세정보", path: "/members/details", permission: ["Admin", "Member"] },
      { name: "등급 관리", path: "/members/grades", permission: ["Admin", "Member"] },
      { name: "포인트 관리", path: "/members/points", permission: ["Admin", "Member"] },
      { name: "마케팅 수신 동의", path: "/members/marketing", permission: ["Admin", "Member", "Marketing"] },
    ],
  },
  {
    id: "coupons",
    name: "쿠폰관리",
    icon: Ticket,
    requiredPermission: ["Admin", "Member", "Marketing"],
    items: [
      { name: "쿠폰 생성", path: "/coupons/create", permission: ["Admin", "Member", "Marketing"] },
      { name: "발급 대상 설정", path: "/coupons/targets", permission: ["Admin", "Member", "Marketing"] },
      { name: "사용 이력 조회", path: "/coupons/history", permission: ["Admin", "Member", "Marketing"] },
      { name: "자동 발급 설정", path: "/coupons/auto", permission: ["Admin", "Member"] },
    ],
  },
  {
    id: "shipping",
    name: "배송설정",
    icon: Truck,
    requiredPermission: ["Admin", "Order"],
    items: [
      { name: "기본 배송비 설정", path: "/shipping/fees", permission: ["Admin", "Order"] },
      { name: "지역/도서산간", path: "/shipping/regions", permission: ["Admin", "Order"] },
      { name: "택배사 설정", path: "/shipping/carriers", permission: ["Admin", "Order"] },
      { name: "출고지/반품지", path: "/shipping/locations", permission: ["Admin", "Order"] },
    ],
  },
  {
    id: "analytics",
    name: "통계/리포트",
    icon: TrendingUp,
    requiredPermission: ["Admin", "Analytics", "Marketing", "Member"],
    items: [
      { name: "매출 통계", path: "/analytics/sales", permission: ["Admin", "Analytics", "Marketing"] },
      { name: "상품별 판매량", path: "/analytics/products", permission: ["Admin", "Analytics", "Product"] },
      { name: "회원 유입/이탈", path: "/analytics/members", permission: ["Admin", "Analytics", "Member"] },
      { name: "이벤트 성과", path: "/analytics/events", permission: ["Admin", "Analytics", "Marketing"] },
    ],
  },
  {
    id: "marketing",
    name: "마케팅/기획전",
    icon: Megaphone,
    requiredPermission: ["Admin", "Marketing"],
    items: [
      { name: "기획전 등록", path: "/marketing/events", permission: ["Admin", "Marketing"] },
      { name: "메인배너/팝업", path: "/marketing/banners", permission: ["Admin", "Marketing"] },
      { name: "후기/리뷰 관리", path: "/marketing/reviews", permission: ["Admin", "Marketing", "Support"] },
    ],
  },
  {
    id: "support",
    name: "고객센터",
    icon: MessageCircle,
    requiredPermission: ["Admin", "Support"],
    items: [
      { name: "1:1 문의 응대", path: "/support/inquiries", permission: ["Admin", "Support"] },
      { name: "후기/Q&A 댓글", path: "/support/comments", permission: ["Admin", "Support"] },
      { name: "FAQ/공지사항", path: "/support/faq", permission: ["Admin", "Support"] },
    ],
  },
  {
    id: "admin",
    name: "관리자 설정",
    icon: Settings,
    requiredPermission: ["Admin"],
    items: [
      { name: "관리자 계정", path: "/admin/accounts", permission: ["Admin"] },
      { name: "권한 그룹 설정", path: "/admin/permissions", permission: ["Admin"] },
      { name: "로그인 기록", path: "/admin/logs", permission: ["Admin"] },
    ],
  },
]

// 관리자 계정 목록 샘플 데이터
const adminAccounts = [
  {
    id: "admin001",
    adminId: "admin@company.com",
    username: "administrator",
    name: "김관리",
    role: "Admin",
    lastLogin: "2024-01-15 14:30",
    status: "활성",
  },
  {
    id: "admin002",
    adminId: "product.manager@company.com",
    username: "product_manager",
    name: "이상품",
    role: "Product",
    lastLogin: "2024-01-15 10:15",
    status: "활성",
  },
  {
    id: "admin003",
    adminId: "order.manager@company.com",
    username: "order_manager",
    name: "박주문",
    role: "Order",
    lastLogin: "2024-01-14 16:45",
    status: "활성",
  },
  {
    id: "admin004",
    adminId: "member.manager@company.com",
    username: "member_manager",
    name: "최회원",
    role: "Member",
    lastLogin: "2024-01-13 09:20",
    status: "활성",
  },
  {
    id: "admin005",
    adminId: "marketing@company.com",
    username: "marketing_team",
    name: "정마케팅",
    role: "Marketing",
    lastLogin: "2024-01-12 11:30",
    status: "활성",
  },
  {
    id: "admin006",
    adminId: "support@company.com",
    username: "cs_support",
    name: "한상담",
    role: "Support",
    lastLogin: "2024-01-11 13:45",
    status: "비활성",
  },
]

// 권한별 계정명 매핑
const roleToUsername: { [key: string]: string } = {
  Admin: "administrator",
  Product: "product_manager",
  Order: "order_manager",
  Member: "member_manager",
  Marketing: "marketing_team",
  Support: "cs_support",
  Analytics: "analytics_viewer", // (추가 필요시)
}

const dashboardStats = [
  { title: "오늘 매출", value: "₩2,450,000", change: "+12.5%", trend: "up", permission: ["Admin", "Analytics"] },
  { title: "신규 주문", value: "156건", change: "+8.2%", trend: "up", permission: ["Admin", "Order", "Analytics"] },
  { title: "신규 회원", value: "23명", change: "-2.1%", trend: "down", permission: ["Admin", "Member", "Analytics"] },
  { title: "재고 부족", value: "8개", change: "0%", trend: "neutral", permission: ["Admin", "Product"] },
]

const recentOrders = [
  {
    id: "ORD-2024-001",
    customer: "김철수",
    amount: "₩125,000",
    status: "배송완료",
    time: "2분 전",
    manager: "주문팀_김영희",
  },
  {
    id: "ORD-2024-002",
    customer: "이영희",
    amount: "₩89,000",
    status: "배송중",
    time: "5분 전",
    manager: "주문팀_박민수",
  },
  {
    id: "ORD-2024-003",
    customer: "박민수",
    amount: "₩234,000",
    status: "입금대기",
    time: "12분 전",
    manager: "주문팀_김영희",
  },
  {
    id: "ORD-2024-004",
    customer: "정수진",
    amount: "₩67,000",
    status: "취소요청",
    time: "18분 전",
    manager: "CS팀_이지은",
  },
]

const activityLogs = [
  { time: "2024-01-15 14:30", user: "admin", action: "상품 등록", target: "신상품_겨울코트", ip: "192.168.1.100" },
  {
    time: "2024-01-15 14:25",
    user: "order_manager",
    action: "주문 상태 변경",
    target: "ORD-2024-001",
    ip: "192.168.1.101",
  },
  {
    time: "2024-01-15 14:20",
    user: "marketing_team",
    action: "쿠폰 발급",
    target: "신년할인_10%",
    ip: "192.168.1.102",
  },
  { time: "2024-01-15 14:15", user: "cs_team", action: "문의 응답", target: "INQ-2024-045", ip: "192.168.1.103" },
]

const statusColors = {
  배송완료: theme.success,
  배송중: theme.primary,
  입금대기: theme.warning,
  취소요청: theme.error,
  처리중: theme.accent,
}

// 권한 체크 함수
function hasPermission(userRole: string, requiredPermissions: string[]): boolean {
  if (requiredPermissions.length === 0) return true
  return requiredPermissions.includes(userRole)
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userRole: string
  setActiveSubmenu: (submenu: string | null) => void
}

function Sidebar({ isOpen, onClose, activeMenu, setActiveMenu, userRole, setActiveSubmenu }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string>("dashboard")

  const filteredMenuItems = menuItems.filter((menu) => hasPermission(userRole, menu.requiredPermission))

  const handleSubmenuClick = (submenu: string) => {
    setActiveSubmenu(submenu)
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      <div
        className={`
        fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        style={{ backgroundColor: theme.surface, borderRight: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: theme.text }}>
              쇼핑몰 관리
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto h-full pb-20">
          {filteredMenuItems.map((menu) => {
            const Icon = menu.icon
            const isExpanded = expandedMenu === menu.id
            const isActive = activeMenu === menu.id

            return (
              <div key={menu.id}>
                <button
                  onClick={() => {
                    setExpandedMenu(isExpanded ? "" : menu.id)
                    setActiveMenu(menu.id)
                    setActiveSubmenu(null)
                  }}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left transition-all
                    hover:scale-105
                  `}
                  style={{
                    backgroundColor: isActive ? theme.primaryLight : "transparent",
                    color: isActive ? theme.primary : theme.text,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{menu.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Submenu */}
                {isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {menu.items
                      .filter((item) => hasPermission(userRole, item.permission))
                      .map((item, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-2 rounded text-sm transition-colors hover:bg-gray-50"
                          style={{ color: theme.textMuted }}
                          onClick={() => handleSubmenuClick(item.name)}
                        >
                          {item.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function TopBar({ onMenuClick, userRole }: { onMenuClick: () => void; userRole: string }) {
  const currentPermission = permissionGroups[userRole as keyof typeof permissionGroups]

  return (
    <div
      className="flex items-center justify-between p-4"
      style={{
        backgroundColor: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5" style={{ color: theme.primary }} />
          <Badge style={{ backgroundColor: theme.error, color: "white" }}>3</Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div
          className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-lg"
          style={{ backgroundColor: currentPermission?.color + "20" }}
        >
          <Shield className="w-4 h-4" style={{ color: currentPermission?.color }} />
          <div className="text-sm">
            <div className="font-medium" style={{ color: theme.text }}>
              {currentPermission?.name}
            </div>
            <div className="text-xs" style={{ color: theme.textMuted }}>
              Level {currentPermission?.level}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block font-medium" style={{ color: theme.text }}>
            관리자
          </span>
        </div>
      </div>
    </div>
  )
}

function PermissionMatrix({ userRole }: { userRole: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" style={{ color: theme.primary }} />
          <span>권한 매트릭스</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: theme.primaryLight }}>
                <th className="p-3 text-left font-medium" style={{ color: theme.text }}>
                  기능
                </th>
                <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                  접근 권한
                </th>
                <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                  현재 사용자
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionMatrix).map(([feature, permissions], index) => {
                const hasAccess = hasPermission(userRole, permissions)
                return (
                  <tr key={index} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td className="p-3" style={{ color: theme.text }}>
                      {feature}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {permissions.map((perm, idx) => (
                          <Badge
                            key={idx}
                            style={{
                              backgroundColor: permissionGroups[perm as keyof typeof permissionGroups]?.color + "20",
                              color: permissionGroups[perm as keyof typeof permissionGroups]?.color,
                            }}
                          >
                            {permissionGroups[perm as keyof typeof permissionGroups]?.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {hasAccess ? (
                        <CheckCircle className="w-5 h-5 mx-auto" style={{ color: theme.success }} />
                      ) : (
                        <XCircle className="w-5 h-5 mx-auto" style={{ color: theme.error }} />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState("all")

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterUser === "all" || log.user === filterUser
    return matchesSearch && matchesFilter
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" style={{ color: theme.primary }} />
            <span>활동 로그</span>
          </CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.textMuted }}
              />
              <Input
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
                <SelectItem value="order_manager">주문팀</SelectItem>
                <SelectItem value="marketing_team">마케팅팀</SelectItem>
                <SelectItem value="cs_team">CS팀</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: theme.background }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div>
                  <div className="font-medium" style={{ color: theme.text }}>
                    {log.action}: {log.target}
                  </div>
                  <div className="text-sm" style={{ color: theme.textMuted }}>
                    {log.user} • {log.time} • {log.ip}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Dashboard({ userRole }: { userRole: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredStats = dashboardStats.filter((stat) => hasPermission(userRole, stat.permission))

  const filteredOrders = recentOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textMuted }}>
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      stat.trend === "up"
                        ? theme.success + "20"
                        : stat.trend === "down"
                          ? theme.error + "20"
                          : theme.accent + "20",
                  }}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      {hasPermission(userRole, ["Admin", "Order"]) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: theme.text }}>최근 주문 현황</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search
                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: theme.textMuted }}
                  />
                  <Input
                    placeholder="주문번호, 고객명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="배송완료">배송완료</SelectItem>
                    <SelectItem value="배송중">배송중</SelectItem>
                    <SelectItem value="입금대기">입금대기</SelectItem>
                    <SelectItem value="취소요청">취소요청</SelectItem>
                  </SelectContent>
                </Select>
                {hasPermission(userRole, ["Admin", "Order"]) && (
                  <Button size="sm" style={{ backgroundColor: theme.primary, color: "white" }}>
                    <Plus className="w-4 h-4 mr-1" />새 주문
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  내보내기
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-mono text-sm" style={{ color: theme.textMuted }}>
                      {order.id}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: theme.text }}>
                        {order.customer}
                      </div>
                      <div className="text-sm" style={{ color: theme.textMuted }}>
                        {order.time} • 담당: {order.manager}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="font-bold" style={{ color: theme.text }}>
                      {order.amount}
                    </div>
                    <Badge
                      style={{
                        backgroundColor: statusColors[order.status as keyof typeof statusColors] + "20",
                        color: statusColors[order.status as keyof typeof statusColors],
                      }}
                    >
                      {order.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {hasPermission(userRole, ["Admin", "Order"]) && (
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permission Matrix */}
      <PermissionMatrix userRole={userRole} />

      {/* Activity Log */}
      {hasPermission(userRole, ["Admin"]) && <ActivityLog />}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hasPermission(userRole, ["Admin", "Product"]) && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 mx-auto mb-4" style={{ color: theme.primary }} />
              <h3 className="font-semibold mb-2" style={{ color: theme.text }}>
                상품 등록
              </h3>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                새로운 상품을 등록하고 관리하세요
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission(userRole, ["Admin", "Member", "Marketing"]) && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-4" style={{ color: theme.accent }} />
              <h3 className="font-semibold mb-2" style={{ color: theme.text }}>
                쿠폰 발급
              </h3>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                고객에게 쿠폰을 발급하세요
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission(userRole, ["Admin", "Marketing"]) && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Megaphone className="w-12 h-12 mx-auto mb-4" style={{ color: theme.warning }} />
              <h3 className="font-semibold mb-2" style={{ color: theme.text }}>
                기획전 등록
              </h3>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                새로운 이벤트를 기획하세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function AdminAccountsPage() {
  const [accounts, setAccounts] = useState([...adminAccounts])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editAccount, setEditAccount] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // 필터링된 계정 목록
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.adminId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || account.role === roleFilter
    return matchesSearch && matchesRole
  })

  // 계정 수정 핸들러
  const handleEditAccount = (account: any) => {
    setEditAccount({ ...account })
    setIsEditDialogOpen(true)
  }

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (account: any) => {
    setEditAccount(account)
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setIsPasswordDialogOpen(true)
  }

  // 계정 삭제 핸들러
  const handleDeleteAccount = (accountId: string) => {
    setAccountToDelete(accountId)
    setIsDeleteDialogOpen(true)
  }

  // 계정 정보 저장
  const saveAccountChanges = () => {
    if (editAccount) {
      setAccounts(accounts.map((account) => (account.id === editAccount.id ? { ...account, ...editAccount } : account)))
      setIsEditDialogOpen(false)
      showSuccessMessage("계정 정보가 성공적으로 수정되었습니다.")
    }
  }

  // 비밀번호 저장
  const savePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (newPassword.length < 4 || newPassword.length > 20) {
      setPasswordError("비밀번호는 4자 이상 20자 이하로 입력하세요.")
      return
    }

    // 실제로는 API 호출로 비밀번호 변경 처리
    setIsPasswordDialogOpen(false)
    showSuccessMessage("비밀번호가 성공적으로 변경되었습니다.")
  }

  // 계정 삭제 확인
  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter((account) => account.id !== accountToDelete))
      setIsDeleteDialogOpen(false)
      showSuccessMessage("계정이 성공적으로 삭제되었습니다.")
    }
  }

  // 성공 메시지 표시
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" style={{ color: theme.primary }} />
              <span>관리자 계정 관리</span>
            </CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: theme.textMuted }}
                />
                <Input
                  placeholder="아이디, 계정명, 이름 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="권한 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 권한</SelectItem>
                  {Object.entries(permissionGroups).map(([key, group]) => (
                    <SelectItem key={key} value={key}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button style={{ backgroundColor: theme.primary, color: "white" }}>
                <UserPlus className="w-4 h-4 mr-2" />새 관리자
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 성공 메시지 */}
          {successMessage && (
            <div
              className="mb-4 p-3 rounded-lg flex items-center space-x-2"
              style={{ backgroundColor: theme.success + "20", color: theme.success }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.primaryLight }}>
                  <th className="p-3 text-left font-medium" style={{ color: theme.text }}>
                    아이디
                  </th>
                  <th className="p-3 text-left font-medium" style={{ color: theme.text }}>
                    계정명
                  </th>
                  <th className="p-3 text-left font-medium" style={{ color: theme.text }}>
                    이름
                  </th>
                  <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                    권한
                  </th>
                  <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                    마지막 로그인
                  </th>
                  <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                    상태
                  </th>
                  <th className="p-3 text-center font-medium" style={{ color: theme.text }}>
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td className="p-3" style={{ color: theme.text }}>
                      {account.adminId}
                    </td>
                    <td className="p-3" style={{ color: theme.text }}>
                      {account.username}
                    </td>
                    <td className="p-3" style={{ color: theme.text }}>
                      {account.name}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        style={{
                          backgroundColor:
                            permissionGroups[account.role as keyof typeof permissionGroups]?.color + "20",
                          color: permissionGroups[account.role as keyof typeof permissionGroups]?.color,
                        }}
                      >
                        {permissionGroups[account.role as keyof typeof permissionGroups]?.name}
                      </Badge>
                    </td>
                    <td className="p-3 text-center" style={{ color: theme.textMuted }}>
                      {account.lastLogin}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        style={{
                          backgroundColor: account.status === "활성" ? theme.success + "20" : theme.error + "20",
                          color: account.status === "활성" ? theme.success : theme.error,
                        }}
                      >
                        {account.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAccount(account)}
                          style={{ borderColor: theme.primary, color: theme.primary }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePasswordChange(account)}
                          style={{ borderColor: theme.accent, color: theme.accent }}
                        >
                          <Key className="w-4 h-4 mr-1" />
                          비밀번호
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAccount(account.id)}
                          style={{ borderColor: theme.error, color: theme.error }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 계정 정보 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 계정 정보 수정</DialogTitle>
            <DialogDescription>계정 정보를 수정하고 저장하세요.</DialogDescription>
          </DialogHeader>
          {editAccount && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: theme.text }}>
                  아이디
                </label>
                <Input
                  type="email"
                  value={editAccount.adminId}
                  onChange={(e) => setEditAccount({ ...editAccount, adminId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: theme.text }}>
                  계정명
                </label>
                <Input
                  value={editAccount.username}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: theme.text }}>
                  이름
                </label>
                <Input
                  value={editAccount.name}
                  onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: theme.text }}>
                  권한
                </label>
                <Select
                  value={editAccount.role}
                  onValueChange={(value) => setEditAccount({ ...editAccount, role: value, username: roleToUsername[value] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(permissionGroups).map(([key, group]) => (
                      <SelectItem key={key} value={key}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: theme.text }}>
                  상태
                </label>
                <Select
                  value={editAccount.status}
                  onValueChange={(value) => setEditAccount({ ...editAccount, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="활성">활성</SelectItem>
                    <SelectItem value="비활성">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={saveAccountChanges} style={{ backgroundColor: theme.primary, color: "white" }}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>
              {editAccount?.name} ({editAccount?.adminId}) 계정의 비밀번호를 변경합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {passwordError && (
              <div
                className="p-3 rounded-lg flex items-center space-x-2"
                style={{ backgroundColor: theme.error + "20", color: theme.error }}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{passwordError}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: theme.text }}>
                새 비밀번호
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: theme.text }}>
                비밀번호 확인
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={savePasswordChange} style={{ backgroundColor: theme.primary, color: "white" }}>
              비밀번호 변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>관리자 계정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount} style={{ backgroundColor: theme.error, color: "white" }}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function EcommerceAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("admin")
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>("관리자 계정")
  const [userRole, setUserRole] = useState("Admin")

  // 현재 활성화된 메뉴와 서브메뉴에 따라 컨텐츠 렌더링
  const renderContent = () => {
    if (activeMenu === "dashboard" || !activeSubmenu) {
      return <Dashboard userRole={userRole} />
    }

    if (activeMenu === "admin" && activeSubmenu === "관리자 계정") {
      return <AdminAccountsPage />
    }

    // 기본적으로 대시보드 표시
    return <Dashboard userRole={userRole} />
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Role Switcher for Demo */}
      <div className="fixed top-4 right-4 z-50">
        <Select value={userRole} onValueChange={setUserRole}>
          <SelectTrigger className="w-48">
            <Shield className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(permissionGroups).map(([key, group]) => (
              <SelectItem key={key} value={key}>
                {group.name} (Level {group.level})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          userRole={userRole}
          setActiveSubmenu={setActiveSubmenu}
        />

        <div className="flex-1 lg:ml-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} userRole={userRole} />

          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                {activeSubmenu || menuItems.find((item) => item.id === activeMenu)?.name || "대시보드"}
              </h1>
              <p style={{ color: theme.textMuted }}>
                {activeSubmenu
                  ? `${activeSubmenu} 관리 페이지입니다.`
                  : permissionGroups[userRole as keyof typeof permissionGroups]?.description}
              </p>
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
