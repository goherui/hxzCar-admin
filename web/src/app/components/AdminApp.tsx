import { useState, useEffect } from "react";
import { useStore, statusLabel, statusColor, Order, Driver } from "../store";
import { passengerApi, orderApi } from "../api";

// 转换下划线命名为驼峰命名
const toCamelCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => toCamelCase(item));
  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};
import {
  LayoutDashboard, ClipboardList, Users, Car, AlertTriangle, DollarSign,
  Settings, Search, TrendingUp, TrendingDown, Ban, CheckCircle2,
  Megaphone, Shield, RefreshCw, Bell, ChevronRight, Zap, Star,
  BarChart2, X, Clock, CreditCard, Phone, Filter, Download, Eye,
  UserCheck, Truck, Plus, MessageCircle, Edit, Target, Activity,
  MapPin, Send, FileText, Wifi, WifiOff, ChevronDown, Award,
  AlertCircle, CheckSquare, ArrowUpRight, ArrowDownRight, PieChart
} from "lucide-react";

type Tab = "dashboard" | "orders" | "drivers" | "users" | "complaints" | "analytics" | "marketing" | "pricing";

export function AdminApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [searchQ, setSearchQ] = useState("");
  const store = useStore();
  const openComplaints = store.complaints.filter((c: any) => c.status === "open").length;

  const navItems = [
    { k: "dashboard", icon: LayoutDashboard, label: "运营看板" },
    { k: "orders", icon: ClipboardList, label: "订单管理" },
    { k: "drivers", icon: Car, label: "司机管理" },
    { k: "users", icon: Users, label: "乘客管理" },
    { k: "complaints", icon: AlertTriangle, label: "投诉工单", badge: openComplaints },
    { k: "analytics", icon: BarChart2, label: "数据分析" },
    { k: "marketing", icon: Megaphone, label: "营销活动" },
    { k: "pricing", icon: DollarSign, label: "计价规则" },
  ];

  return (
    <div className="w-full h-[780px] bg-gray-100 rounded-2xl shadow-2xl flex overflow-hidden">
      {/* 侧边栏 */}
      <aside className="w-52 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-lg">🚕</div>
            <div>
              <div className="text-sm font-medium">花小猪运营台</div>
              <div className="text-[10px] text-white/50">Admin Console</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ k, icon: Icon, label, badge }) => (
            <button key={k} onClick={() => setTab(k as Tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${tab === k ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
              {badge! > 0 && (
                <span className="ml-auto w-4 h-4 bg-rose-500 rounded-full text-[9px] flex items-center justify-center">{badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">管</div>
          <div className="text-xs flex-1">
            <div className="font-medium">admin</div>
            <div className="text-[10px] text-white/50">超级管理员</div>
          </div>
          <Settings className="w-3.5 h-3.5 text-white/40" />
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0">
        {/* 顶部栏 */}
        <div className="h-14 bg-white border-b flex items-center px-5 justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-800">{navItems.find(n => n.k === tab)?.label}</div>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">实时</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input 
                value={searchQ} 
                onChange={e => setSearchQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQ(e.target.value)}
                placeholder="搜索订单/司机/乘客..." 
                className="bg-transparent outline-none w-40 text-gray-700" 
              />
            </div>
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center relative">
              <Bell className="w-4 h-4 text-gray-500" />
              {openComplaints > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />}
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "dashboard" && <Dashboard store={store} />}
          {tab === "orders" && <OrdersPage store={store} searchQuery={searchQ} />}
          {tab === "drivers" && <DriversPage store={store} />}
          {tab === "users" && <UsersPage store={store} />}
          {tab === "complaints" && <ComplaintsPage store={store} />}
          {tab === "analytics" && <AnalyticsPage store={store} />}
          {tab === "marketing" && <MarketingPage store={store} />}
          {tab === "pricing" && <PricingPage />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   运营看板
   ============================================================ */
function Dashboard({ store }: any) {
  const { orders, drivers, complaints } = store;
  const completed = orders.filter((o: any) => o.status === "completed");
  const gmv = completed.reduce((s: number, o: any) => s + o.price, 0);
  const onlineDrivers = drivers.filter((d: any) => d.online).length;
  const openComplaints = complaints.filter((c: any) => c.status === "open").length;
  const ongoing = orders.filter((o: any) => ["accepted", "arrived", "ongoing"].includes(o.status)).length;
  const pending = orders.filter((o: any) => o.status === "pending").length;

  const kpis = [
    { label: "今日订单总量", val: orders.length, delta: "+12.5%", up: true, sub: `完成 ${completed.length} 取消 ${orders.filter((o: any) => o.status === "cancelled").length}`, color: "from-orange-400 to-pink-500", icon: "📦" },
    { label: "今日GMV", val: `¥${(gmv + 1280).toFixed(0)}`, delta: "+8.3%", up: true, sub: "较昨日↑152元", color: "from-emerald-400 to-teal-500", icon: "💰" },
    { label: "实时在线司机", val: onlineDrivers, delta: `行程中 ${drivers.filter((d: any) => d.status === "busy").length}`, up: true, sub: `空闲 ${drivers.filter((d: any) => d.status === "idle").length}`, color: "from-blue-400 to-indigo-500", icon: "🚗" },
    { label: "实时进行订单", val: ongoing, delta: `待接单 ${pending}`, up: pending === 0, sub: openComplaints > 0 ? `⚠️ ${openComplaints}个待处理投诉` : "无待处理投诉", color: "from-violet-400 to-purple-500", icon: "⚡" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500">{c.label}</div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-sm`}>{c.icon}</div>
            </div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent mb-1`}>{c.val}</div>
            <div className="flex items-center justify-between">
              <div className={`text-xs flex items-center gap-0.5 ${c.up ? "text-emerald-500" : "text-rose-500"}`}>
                {c.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{c.delta}
              </div>
              <div className="text-[10px] text-gray-400">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 订单趋势 + 业务分布 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-800">近7日订单趋势</div>
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />订单量</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />GMV(百元)</span>
            </div>
          </div>
          <div className="h-40 flex items-end gap-2">
            {[{ o: 42, g: 85 }, { o: 58, g: 75 }, { o: 51, g: 68 }, { o: 73, g: 92 }, { o: 65, g: 78 }, { o: 89, g: 96 }, { o: 94, g: 100 }]
              .map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end">
                    <div className="flex-1 rounded-t bg-gradient-to-t from-orange-400 to-orange-300" style={{ height: `${d.o * 1.5}px` }} />
                    <div className="flex-1 rounded-t bg-gradient-to-t from-emerald-400 to-emerald-300" style={{ height: `${d.g * 1.3}px` }} />
                  </div>
                  <div className="text-[9px] text-gray-400">{["一", "二", "三", "四", "五", "六", "日"][i]}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-800 mb-4">业务类型分布</div>
          <div className="space-y-3">
            {[
              { name: "特惠快车", pct: 62, color: "bg-orange-500" },
              { name: "舒适型", pct: 18, color: "bg-pink-500" },
              { name: "顺风车", pct: 12, color: "bg-violet-500" },
              { name: "专车", pct: 8, color: "bg-emerald-500" },
            ].map(x => (
              <div key={x.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{x.name}</span>
                  <span className="text-gray-800 font-medium">{x.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${x.color} rounded-full`} style={{ width: `${x.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 供需概览 + 实时订单流 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-800 mb-3">城市供需概览</div>
          {[{ city: "北京", demand: 94, supply: 82 }, { city: "上海", demand: 88, supply: 91 }, { city: "深圳", demand: 76, supply: 70 }, { city: "杭州", demand: 65, supply: 72 }, { city: "宿迁", demand: 58, supply: 61 }]
            .map(c => (
              <div key={c.city} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600 w-8">{c.city}</span>
                <div className="flex-1">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.demand > c.supply ? "bg-rose-400" : "bg-emerald-400"} rounded-full`}
                      style={{ width: `${Math.max(c.demand, c.supply)}%` }} />
                  </div>
                </div>
                <span className={`text-[10px] w-10 text-right ${c.demand > c.supply ? "text-rose-500" : "text-emerald-500"}`}>
                  {c.demand > c.supply ? "供不足" : "供充足"}
                </span>
              </div>
            ))}
        </div>

        {/* 实时订单流 */}
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-800">实时订单流</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />实时更新
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b">
                <th className="text-left py-1.5 font-normal">订单号</th>
                <th className="text-left font-normal">起点</th>
                <th className="text-left font-normal">终点</th>
                <th className="text-left font-normal">司机</th>
                <th className="text-left font-normal">金额</th>
                <th className="text-left font-normal">状态</th>
              </tr>
            </thead>
            <tbody>
              {store.orders.slice(0, 5).map((o: any) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2 text-xs text-gray-500 font-mono">{o.id.slice(-6)}</td>
                  <td className="text-xs text-gray-700 max-w-[70px] truncate">{o.from}</td>
                  <td className="text-xs text-gray-700 max-w-[70px] truncate">{o.to}</td>
                  <td className="text-xs text-gray-600">{o.driverName || <span className="text-amber-500">待分配</span>}</td>
                  <td className="text-xs text-orange-500 font-medium">¥{o.price}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColor[o.status as keyof typeof statusColor]}`}>{statusLabel[o.status as keyof typeof statusLabel]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 司机实时状态 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-800 mb-3">司机实时状态</div>
        <div className="grid grid-cols-4 gap-3">
          {store.drivers.map((d: any) => (
            <div key={d.id} className={`rounded-xl p-3 border ${d.status === "busy" ? "bg-amber-50 border-amber-200" : d.online ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-base">👨‍✈️</div>
                <div>
                  <div className="text-xs font-medium text-gray-800">{d.name}</div>
                  <div className="text-[9px] text-gray-400">{d.plate}</div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${d.status === "busy" ? "bg-amber-100 text-amber-700" : d.online ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                <div className={`w-1 h-1 rounded-full ${d.status === "busy" ? "bg-amber-500" : d.online ? "bg-emerald-500" : "bg-gray-400"}`} />
                {d.status === "busy" ? "行程中" : d.online ? "空闲待单" : "离线"}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">¥{d.todayEarnings} 今日</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   订单管理
   ============================================================ */
function OrdersPage({ store, searchQuery }: any) {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dispatchOpen, setDispatchOpen] = useState<Order | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState(searchQuery || "");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // 状态映射：后端数字状态值 -> 前端字符串状态值
  const mapStatus = (status: number): string => {
    switch (status) {
      case 0: return "pending";
      case 1: return "accepted";
      case 2: return "ongoing";
      case 3: return "toPay";
      case 4: return "completed";
      case 5: return "cancelled";
      default: return "pending";
    }
  };

  // 当searchQuery变化时更新search状态并触发搜索
  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery || "");
      setPage(1);
      loadOrders();
    }
  }, [searchQuery]);

  // 加载订单列表
  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrderList({
        order_no: search || undefined,
        driver_name: search || undefined,
        passenger_name: search || undefined,
        page,
        page_size: pageSize,
      });
      if (res.code === 0) {
        // 转换状态值：后端数字 -> 前端字符串，并转换字段名为驼峰命名
        const mappedOrders = (res.data.orders || []).map((order: any) => {
          const camelOrder = toCamelCase(order);
          return {
            ...camelOrder,
            status: mapStatus(camelOrder.status)
          };
        });
        setOrders(mappedOrders);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error("加载订单列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, search, searchQuery]);

  // 处理搜索
  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  // 获取订单详情
  const loadOrderDetail = async (orderId: number) => {
    setDetailLoading(true);
    try {
      const res = await orderApi.getOrderDetail(orderId);
      if (res.code === 0) {
        // 转换字段名为驼峰命名
        const camelOrder = toCamelCase(res.data);
        setSelectedOrder(camelOrder);
      }
    } catch (error) {
      console.error("加载订单详情失败:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 过滤订单
  const list = filter === "all" ? orders : orders.filter((o: any) => {
    if (filter === "ongoing") {
      return ["accepted", "arrived", "ongoing"].includes(o.status);
    }
    return o.status === filter;
  });

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="搜索订单号/司机/乘客..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <Search className="w-4 h-4" />搜索
          </button>
        </div>
      </div>

      {/* 概览卡 */}
      <div className="grid grid-cols-5 gap-3">
        {
          [
            { k: "all", label: "全部", val: orders.length, color: "text-gray-700", bg: "bg-white" },
            { k: "pending", label: "等待接单", val: orders.filter((o: any) => o.status === "pending").length, color: "text-amber-700", bg: "bg-amber-50" },
            { k: "ongoing", label: "行程中", val: orders.filter((o: any) => ["accepted", "arrived", "ongoing"].includes(o.status)).length, color: "text-violet-700", bg: "bg-violet-50" },
            { k: "completed", label: "已完成", val: orders.filter((o: any) => o.status === "completed").length, color: "text-emerald-700", bg: "bg-emerald-50" },
            { k: "cancelled", label: "已取消", val: orders.filter((o: any) => o.status === "cancelled").length, color: "text-gray-600", bg: "bg-gray-50" },
          ].map(c => (
            <button key={c.k} onClick={() => setFilter(c.k)}
              className={`${c.bg} rounded-xl p-3 text-center border-2 transition-all ${filter === c.k ? "border-slate-900" : "border-transparent"}`}>
              <div className={`text-xl font-bold ${c.color}`}>{c.val}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{c.label}</div>
            </button>
          ))
        }
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex gap-2 flex-wrap">
            {[["all", "全部"], ["pending", "待接单"], ["accepted", "已接单"], ["ongoing", "行程中"], ["toPay", "待支付"], ["completed", "已完成"], ["cancelled", "已取消"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${filter === k ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {l}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 border rounded-lg px-3 py-1.5">
            <Download className="w-3.5 h-3.5" />导出
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">加载中...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b bg-gray-50">
                <th className="text-left px-4 py-2.5 font-normal">订单号</th>
                <th className="text-left font-normal">乘客</th>
                <th className="text-left font-normal">司机</th>
                <th className="text-left font-normal">起点→终点</th>
                <th className="text-left font-normal">车型</th>
                <th className="text-left font-normal">金额</th>
                <th className="text-left font-normal">状态</th>
                <th className="text-left font-normal">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o: any) => (
                <tr key={o.orderId} className="border-b last:border-0 hover:bg-gray-50 group">
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{o.orderNo}</td>
                  <td className="text-xs text-gray-700">{o.passengerName}<div className="text-[10px] text-gray-400">{o.passengerPhone}</div></td>
                  <td className="text-xs">
                    {o.driverName
                      ? <div>{o.driverName}<div className="text-[10px] text-gray-400">{o.driverPhone}</div></div>
                      : <span className="text-amber-500">待分配</span>}
                  </td>
                  <td className="text-xs text-gray-600 max-w-[120px]">
                    <div className="truncate">{o.startAddr}</div>
                    <div className="truncate text-gray-400">→{o.endAddr}</div>
                  </td>
                  <td className="text-xs text-gray-700">{o.carType}</td>
                  <td className="text-xs">
                    <span className="text-orange-500 font-medium">¥{o.finalAmount}</span>
                  </td>
                  <td><span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor[o.status as keyof typeof statusColor]}`}>{statusLabel[o.status as keyof typeof statusLabel]}</span></td>
                  <td>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => loadOrderDetail(o.orderId)} className="text-xs text-blue-500 hover:underline flex items-center gap-0.5"><Eye className="w-3 h-3" />详情</button>
                      {o.status === 0 && (
                        <button onClick={() => setDispatchOpen(o)} className="text-xs text-emerald-500 hover:underline flex items-center gap-0.5"><Truck className="w-3 h-3" />指派</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-sm">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-xs text-gray-400">
              第 {page} / {totalPages} 页，共 {total} 条
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 订单详情弹窗 */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} store={store}
          onClose={() => setSelectedOrder(null)}
          onDispatch={() => { setDispatchOpen(selectedOrder); setSelectedOrder(null); }} />
      )}

      {/* 指派司机弹窗 */}
      {dispatchOpen && (
        <DispatchModal order={dispatchOpen} drivers={store.drivers}
          onClose={() => setDispatchOpen(null)}
          onDispatch={async (driverId: string) => {
            try {
              const orderId = dispatchOpen.order_id || dispatchOpen.orderId || dispatchOpen.id;
              await store.acceptOrder(String(orderId), driverId);
              setDispatchOpen(null);
              // 重新加载订单列表以更新状态
              loadOrders();
            } catch (error) {
              console.error("指派司机失败:", error);
            }
          }} />
      )}
    </div>
  );
}

/* 订单详情弹窗 */
function OrderDetailModal({ order, store, onClose, onDispatch }: any) {
  // 状态映射：后端数字状态值 -> 前端字符串状态值
  const mapStatus = (status: number): string => {
    switch (status) {
      case 0: return "pending";
      case 1: return "accepted";
      case 2: return "ongoing";
      case 3: return "toPay";
      case 4: return "completed";
      case 5: return "cancelled";
      default: return "pending";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b z-10">
          <div>
            <div className="font-medium text-gray-900">订单详情</div>
            <div className="text-xs text-gray-400 mt-0.5">#{order.order_id}</div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* 状态 */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm ${statusColor[order.status as keyof typeof statusColor]}`}>{statusLabel[order.status as keyof typeof statusLabel]}</span>
            <span className="text-xs text-gray-400">{order.createTime ? new Date(order.createTime).toLocaleString("zh-CN") : "-"}</span>
          </div>

          {/* 路线 */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex gap-2 items-start">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              <div><div className="text-sm text-gray-800">{order.startAddr || "-"}</div><div className="text-[10px] text-gray-400">上车点</div></div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
              <div><div className="text-sm text-gray-800">{order.endAddr || "-"}</div><div className="text-[10px] text-gray-400">目的地</div></div>
            </div>
          </div>

          {/* 乘客+司机 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1.5 font-medium">乘客信息</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-base">👤</div>
                <div>
                  <div className="text-sm font-medium">{order.passengerName || "-"}</div>
                  <div className="text-[10px] text-gray-500">{order.passengerPhone || "-"}</div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1.5 font-medium">司机信息</div>
              {order.driverName ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-base">👨‍✈️</div>
                  <div>
                  <div className="text-sm font-medium">{order.driverName || "-"}</div>
                  <div className="text-[10px] text-gray-500">{order.driverPhone || "-"}</div>
                </div>
                </div>
              ) : (
                <div className="text-sm text-amber-500 flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-4 h-4" />待分配
                </div>
              )}
            </div>
          </div>

          {/* 费用明细 */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">费用明细</div>
            {
              [
                { label: "车型", val: order.carType || "-" },
                { label: "距离", val: `${order.distance ? order.distance.toFixed(2) : "-"}km` },
                { label: "预估时长", val: `${order.estimatedTime || "-"}分钟` },
                { label: "实际费用", val: `¥${order.finalAmount || "-"}`, bold: true },
                ...(order.discountAmount > 0 ? [{ label: "优惠券", val: `-¥${order.discountAmount}`, red: true }] : []),
                ...(order.paymentMethod ? [{ label: "支付方式", val: order.paymentMethod }] : []),
                ...(order.notes ? [{ label: "乘客备注", val: order.notes }] : []),
              ].map((item: any, i) => (
                <div key={i} className="flex justify-between px-4 py-2.5 border-t text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={item.bold ? "font-medium text-gray-900" : item.red ? "text-rose-500" : "text-gray-700"}>{item.val}</span>
                </div>
              ))
            }
          </div>

          {/* 状态历史 */}
          {order.statusLogs && order.statusLogs.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">状态历史</div>
              <div className="divide-y">
                {order.statusLogs.map((log: any, index: number) => (
                  <div key={log.id || index} className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-500">{index + 1}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{statusLabel[mapStatus(log.status) as keyof typeof statusLabel]}</div>
                          <div className="text-xs text-gray-400">{log.createTime ? new Date(log.createTime).toLocaleString("zh-CN") : "-"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{log.operatorType || "系统"}</div>
                        {log.remark && <div className="text-xs text-gray-400 mt-1">{log.remark}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {order.status === 0 && (
              <button onClick={onDispatch} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4" />指派司机
              </button>
            )}
            {["pending", "accepted", "arrived"].includes(order.status) && (
              <button onClick={() => { store.cancelOrder(order.id); onClose(); }}
                className="flex-1 border border-rose-200 text-rose-500 py-2.5 rounded-xl text-sm">
                取消订单
              </button>
            )}
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">关闭</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 指派司机弹窗 */
function DispatchModal({ order, drivers, onClose, onDispatch }: any) {
  const idle = drivers.filter((d: any) => d.online && d.status === "idle");
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <div className="font-medium">指派司机</div>
            <div className="text-xs text-gray-400 mt-0.5">订单 #{order.order_no || order.orderId || order.id}</div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs">
            <div className="flex gap-2 mb-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0" /><span>{order.startAddr || order.from}</span></div>
            <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5 flex-shrink-0" /><span>{order.endAddr || order.to}</span></div>
          </div>
          <div className="text-xs text-gray-500 mb-3">选择空闲司机 ({idle.length}位可用)</div>
          {idle.length === 0 && <div className="text-center py-6 text-gray-400 text-sm">暂无空闲司机</div>}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {idle.map((d: any) => (
              <button key={d.id} onClick={() => onDispatch(String(d.id))}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all group">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">👨‍✈️</div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-800">{d.name}</div>
                  <div className="text-[10px] text-gray-400">{d.plate} · {d.car}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-xs text-amber-500"><Star className="w-3 h-3 fill-current" />{d.rating}</div>
                  <div className="text-[10px] text-gray-400">距 1.2km</div>
                </div>
                <Truck className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   司机管理
   ============================================================ */
function DriversPage({ store }: any) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  return (
    <div className="space-y-4">
      {/* 概览卡 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "在线司机", val: store.drivers.filter((d: any) => d.online).length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "行程中", val: store.drivers.filter((d: any) => d.status === "busy").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "空闲待单", val: store.drivers.filter((d: any) => d.status === "idle").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "已下线", val: store.drivers.filter((d: any) => !d.online).length, color: "text-gray-600", bg: "bg-gray-50" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${c.color}`}>{c.val}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm font-medium">司机列表</div>
          <button className="flex items-center gap-1.5 text-xs text-blue-500 border border-blue-200 rounded-lg px-3 py-1.5">
            <Plus className="w-3.5 h-3.5" />新增司机
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b bg-gray-50">
              <th className="text-left px-4 py-2.5 font-normal">司机</th>
              <th className="text-left font-normal">手机</th>
              <th className="text-left font-normal">车牌/车型</th>
              <th className="text-left font-normal">评分</th>
              <th className="text-left font-normal">总单数</th>
              <th className="text-left font-normal">今日收入</th>
              <th className="text-left font-normal">服务分</th>
              <th className="text-left font-normal">状态</th>
              <th className="text-left font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {store.drivers.map((d: any) => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50 group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm">👨‍✈️</div>
                    <div>
                      <div className="text-xs font-medium text-gray-800">{d.name}</div>
                      <div className="text-[10px] text-gray-400">ID: {d.id}</div>
                    </div>
                  </div>
                </td>
                <td className="text-xs text-gray-600">{d.phone}</td>
                <td>
                  <div className="text-xs text-gray-700">{d.plate}</div>
                  <div className="text-[10px] text-gray-400">{d.car}</div>
                </td>
                <td className="text-xs">
                  <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-current" />{d.rating}</span>
                </td>
                <td className="text-xs text-gray-700">{d.totalOrders}</td>
                <td className="text-xs text-emerald-600 font-medium">¥{d.todayEarnings}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.floor(d.rating * 20)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{Math.floor(d.rating * 20)}</span>
                  </div>
                </td>
                <td>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status === "idle" ? "bg-emerald-100 text-emerald-700" : d.status === "busy" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                    {d.status === "idle" ? "空闲" : d.status === "busy" ? "接单中" : "离线"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedDriver(d)} className="text-xs text-blue-500 hover:underline flex items-center gap-0.5"><Eye className="w-3 h-3" />详情</button>
                    <button onClick={() => store.banDriver(d.id)} className="text-xs text-rose-500 flex items-center gap-0.5 hover:underline"><Ban className="w-3 h-3" />封禁</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 司机详情侧板 */}
      {selectedDriver && (
        <DriverDetailModal driver={selectedDriver} store={store} onClose={() => setSelectedDriver(null)} />
      )}
    </div>
  );
}

/* 司机详情弹窗 */
function DriverDetailModal({ driver, store, onClose }: any) {
  const driverOrders = store.orders.filter((o: any) => o.driverId === driver.id && o.status === "completed");
  const complaints = store.complaints.filter((c: any) => {
    const o = store.orders.find((x: any) => x.id === c.orderId);
    return o?.driverId === driver.id;
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b z-10">
          <div className="font-medium">司机档案</div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* 基本信息 */}
          <div className={`rounded-2xl p-4 ${driver.online ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-gray-500 to-gray-600"} text-white`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-3xl">👨‍✈️</div>
              <div>
                <div className="font-medium text-lg flex items-center gap-2">
                  {driver.name}
                  <span className="bg-amber-400 text-gray-800 text-[10px] px-1.5 py-0.5 rounded font-bold">金牌</span>
                </div>
                <div className="text-white/80 text-xs mt-0.5">{driver.plate} · {driver.car}</div>
                <div className="text-white/80 text-xs">{driver.phone}</div>
              </div>
              <div className="ml-auto">
                <div className={`text-xs px-2 py-1 rounded-full ${driver.online ? "bg-white/20" : "bg-white/10"}`}>
                  {driver.status === "busy" ? "接单中" : driver.online ? "空闲" : "离线"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              {[
                { v: driver.rating, l: "评分" },
                { v: driver.totalOrders, l: "总单数" },
                { v: `¥${driver.todayEarnings}`, l: "今日收入" },
                { v: "98%", l: "好评率" },
              ].map(x => (
                <div key={x.l} className="bg-white/15 rounded-xl py-2">
                  <div className="font-medium">{x.v}</div>
                  <div className="opacity-80 mt-0.5">{x.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 服务分 */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">服务分明细</div>
            {[
              { name: "行程评分", score: 98 }, { name: "接单率", score: 94 },
              { name: "完单率", score: 99 }, { name: "安全驾驶", score: 96 },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-3 px-4 py-2.5 border-t text-sm">
                <span className="text-gray-600 w-16">{item.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
                <span className="text-xs font-medium text-blue-600 w-8 text-right">{item.score}</span>
              </div>
            ))}
          </div>

          {/* 近期订单 */}
          <div>
            <div className="text-sm font-medium text-gray-800 mb-2">近期订单 ({driverOrders.length}单)</div>
            {driverOrders.slice(0, 3).map((o: any) => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b last:border-0 text-xs">
                <div>
                  <div className="text-gray-800 truncate w-48">{o.from} → {o.to}</div>
                  <div className="text-gray-400">{new Date(o.createdAt).toLocaleDateString("zh-CN")}</div>
                </div>
                <span className="text-emerald-600 font-medium">+¥{o.price}</span>
              </div>
            ))}
            {driverOrders.length === 0 && <div className="text-xs text-gray-400 py-2">暂无完成订单</div>}
          </div>

          {/* 投诉记录 */}
          {complaints.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
              <div className="text-xs font-medium text-rose-700 mb-2">投诉记录 ({complaints.length})</div>
              {complaints.map((c: any) => (
                <div key={c.id} className="text-xs text-rose-600 mb-1">· {c.content}</div>
              ))}
            </div>
          )}

          {/* 操作 */}
          <div className="flex gap-3">
            <button onClick={() => { store.setDriverOnline(driver.id, !driver.online); onClose(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm ${driver.online ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
              {driver.online ? "强制下线" : "恢复上线"}
            </button>
            <button onClick={() => { store.banDriver(driver.id); onClose(); }}
              className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5">
              <Ban className="w-4 h-4" />封禁账号
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   乘客管理
   ============================================================ */
function UsersPage({ store }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const loadPassengers = async () => {
    setLoading(true);
    try {
      const res = await passengerApi.getPassengerList({
        phone: phone || undefined,
        page,
        page_size: pageSize,
      });
      if (res.code === 0) {
        // 转换字段名为驼峰命名
        const camelPassengers = toCamelCase(res.data.passengers || []);
        setPassengers(camelPassengers);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error("加载乘客列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassengers();
  }, [page, phone]);

  const handleSearch = () => {
    setPage(1);
    loadPassengers();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* 概览 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "注册用户", val: total, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "活跃用户(30天)", val: total, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "新增用户(今日)", val: 1, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "用户投诉率", val: "2.1%", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${c.color}`}>{c.val}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="输入手机号搜索"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <Search className="w-4 h-4" />搜索
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm font-medium">乘客列表</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">共 {total} 名乘客</div>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">加载中...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b bg-gray-50">
                <th className="text-left px-4 py-2.5 font-normal">用户</th>
                <th className="text-left font-normal">手机</th>
                <th className="text-left font-normal">累计订单</th>
                <th className="text-left font-normal">累计消费</th>
                <th className="text-left font-normal">会员等级</th>
                <th className="text-left font-normal">注册日期</th>
                <th className="text-left font-normal">状态</th>
                <th className="text-left font-normal">操作</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((u: any) => {
                const statusText = u.status === 1 ? "正常" : "已封禁";
                const statusClass = u.status === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
                return (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm">👤</div>
                        <span className="text-xs text-gray-700">{u.nickname || "未设置昵称"}</span>
                      </div>
                    </td>
                    <td className="text-xs text-gray-600">{u.phone}</td>
                    <td className="text-xs text-gray-700">{u.totalOrders || 0}</td>
                    <td className="text-xs text-orange-500 font-medium">¥{(u.totalAmount || 0).toFixed(2)}</td>
                    <td><span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{u.memberLevel || "普通"}</span></td>
                    <td className="text-xs text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("zh-CN") : "-"}</td>
                    <td><span className={`text-[10px] px-2 py-0.5 rounded-full ${statusClass}`}>{statusText}</span></td>
                    <td>
                      <button onClick={() => setSelectedUser(u)}
                        className="text-xs text-blue-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />详情
                      </button>
                    </td>
                  </tr>
                );
              })}
              {passengers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-sm">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-xs text-gray-400">
              第 {page} / {totalPages} 页，共 {total} 条
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onRefresh={loadPassengers} />
      )}
    </div>
  );
}

/* 用户详情弹窗 */
function UserDetailModal({ user, onClose, onRefresh }: { user: any; onClose: () => void; onRefresh: () => void }) {
  const [issuing, setIssuing] = useState(false);
  const [adjustingBalance, setAdjustingBalance] = useState(false);
  const [banning, setBanning] = useState(false);
  const [couponAmt, setCouponAmt] = useState("5");
  const [couponType, setCouponType] = useState("全部车型");
  const [couponDays, setCouponDays] = useState("7");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceReason, setBalanceReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [loading, setLoading] = useState(false);

  const memberLevel = user.MemberLevel || "普通";
  const memberLevelMap: Record<string, string> = {
    "普通": "V1",
    "白银": "V2",
    "黄金": "V3",
    "白金": "V4",
    "钻石": "V5"
  };

  const handleIssueCoupon = async () => {
    setLoading(true);
    try {
      const res = await passengerApi.issueCoupon({
        passenger_id: user.Id,
        coupon_amount: parseInt(couponAmt),
        valid_days: parseInt(couponDays),
        coupon_type: couponType,
      });
      if (res.code === 0) {
        alert("优惠券发放成功");
        setIssuing(false);
      } else {
        alert("发放失败: " + res.msg);
      }
    } catch (error) {
      alert("发放失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!balanceAmount || !balanceReason) {
      alert("请填写完整的调整信息");
      return;
    }
    setLoading(true);
    try {
      const res = await passengerApi.updateBalance({
        passenger_id: user.Id,
        amount: parseFloat(balanceAmount),
        reason: balanceReason,
      });
      if (res.code === 0) {
        alert("余额调整成功");
        setAdjustingBalance(false);
        onRefresh();
      } else {
        alert("调整失败: " + res.msg);
      }
    } catch (error) {
      alert("调整失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBanAccount = async () => {
    if (!banReason) {
      alert("请填写封禁原因");
      return;
    }
    setLoading(true);
    try {
      const res = await passengerApi.banAccount({
        passenger_id: user.Id,
        banned: user.Status !== 0,
        reason: banReason,
      });
      if (res.code === 0) {
        alert(user.Status !== 0 ? "账户已封禁" : "账户已解封");
        setBanning(false);
        onRefresh();
      } else {
        alert("操作失败: " + res.msg);
      }
    } catch (error) {
      alert("操作失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b z-10">
          <div className="font-medium">用户档案</div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* 用户卡 */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-3xl">👤</div>
              <div>
                <div className="font-medium text-lg">{user.Nickname || "未设置昵称"}</div>
                <div className="text-white/80 text-xs mt-0.5">{user.Phone}</div>
              </div>
              <span className="ml-auto bg-amber-400 text-gray-800 text-[10px] px-2 py-1 rounded-full font-bold">
                {memberLevelMap[memberLevel] || "V1"} {memberLevel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              {
                [
                  { v: user.TotalOrders || 0, l: "总订单" },
                  { v: `¥${(user.TotalAmount || 0).toFixed(0)}`, l: "累计消费" },
                  { v: user.Status === 1 ? "正常" : "已封禁", l: "账户状态" }
                ].map(x => (
                  <div key={x.l} className="bg-white/15 rounded-xl py-2">
                    <div className="font-medium">{x.v}</div>
                    <div className="opacity-80 mt-0.5">{x.l}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* 用户信息 */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">用户ID</span>
              <span className="text-gray-700">{user.Id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">注册时间</span>
              <span className="text-gray-700">{user.CreatedAt ? new Date(user.CreatedAt).toLocaleString("zh-CN") : "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">会员等级</span>
              <span className="text-gray-700">{memberLevel}</span>
            </div>
          </div>

          {/* 调整余额 */}
          <div className="border rounded-xl overflow-hidden">
            <button onClick={() => setAdjustingBalance(!adjustingBalance)}
              className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <span className="text-sm font-medium text-emerald-700 flex items-center gap-2"><DollarSign className="w-4 h-4" />调整余额</span>
              <ChevronDown className={`w-4 h-4 text-emerald-500 transition-transform ${adjustingBalance ? "rotate-180" : ""}`} />
            </button>
            {adjustingBalance && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">调整金额(元)</div>
                  <input type="number" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)}
                    placeholder="正数增加，负数减少"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">调整原因</div>
                  <input type="text" value={balanceReason} onChange={e => setBalanceReason(e.target.value)}
                    placeholder="请输入调整原因"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                </div>
                <button onClick={handleAdjustBalance} disabled={loading}
                  className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                  {loading ? "处理中..." : "确认调整"}
                </button>
              </div>
            )}
          </div>

          {/* 发放优惠券 */}
          <div className="border rounded-xl overflow-hidden">
            <button onClick={() => setIssuing(!issuing)}
              className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors">
              <span className="text-sm font-medium text-orange-700 flex items-center gap-2"><Plus className="w-4 h-4" />向该用户发放优惠券</span>
              <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${issuing ? "rotate-180" : ""}`} />
            </button>
            {issuing && (
              <div className="p-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">券面额(元)</div>
                  <input type="number" value={couponAmt} onChange={e => setCouponAmt(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">有效期(天)</div>
                  <input type="number" value={couponDays} onChange={e => setCouponDays(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">优惠券类型</div>
                  <select value={couponType} onChange={e => setCouponType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400">
                    {["全部车型", "特惠快车", "顺风车", "专车", "舒适型"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <button onClick={handleIssueCoupon} disabled={loading}
                  className="col-span-2 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                  {loading ? "处理中..." : "✓ 确认发放"}
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setAdjustingBalance(true)}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1">
              <DollarSign className="w-4 h-4" />调整余额
            </button>
            <button onClick={() => setBanning(true)}
              className="flex-1 border border-rose-200 text-rose-500 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1">
              <Ban className="w-4 h-4" />{user.status === 1 ? "封禁账户" : "解封账户"}
            </button>
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">关闭</button>
          </div>

          {/* 封禁确认对话框 */}
          {banning && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <Ban className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.status === 1 ? "确认封禁该账户？" : "确认解封该账户？"}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">操作原因</div>
                    <input type="text" value={banReason} onChange={e => setBanReason(e.target.value)}
                      placeholder="请输入操作原因"
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-400" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setBanning(false)}
                      className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">
                      取消
                    </button>
                    <button onClick={handleBanAccount} disabled={loading}
                      className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl text-sm disabled:opacity-50">
                      {loading ? "处理中..." : "确认"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   投诉工单
   ============================================================ */
function ComplaintsPage({ store }: any) {
  const [selectedC, setSelectedC] = useState<any>(null);
  const [note, setNote] = useState("");
  const open = store.complaints.filter((c: any) => c.status === "open").length;
  const resolved = store.complaints.filter((c: any) => c.status === "resolved").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { val: open, label: "待处理", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
          { val: resolved, label: "已解决", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { val: open + resolved > 0 ? `${Math.round(resolved / (open + resolved) * 100)}%` : "0%", label: "结案率", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { val: "4.2h", label: "平均处理时长", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-xl p-3 border text-center`}>
            <div className={`text-2xl font-bold ${c.color}`}>{c.val}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {store.complaints.map((c: any) => {
          const order = store.orders.find((o: any) => o.id === c.orderId);
          const driver = order ? store.drivers.find((d: any) => d.id === order.driverId) : null;
          return (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">工单 {c.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.from === "passenger" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                      {c.from === "passenger" ? "乘客投诉" : "司机投诉"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>订单 #{c.orderId.slice(-6)}</span>
                    {driver && <span>· 司机: {driver.name}</span>}
                    <span>{new Date(c.createdAt).toLocaleString("zh-CN")}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full ${c.status === "open" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {c.status === "open" ? "待处理" : "已解决"}
                </span>
              </div>

              <div className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">{c.content}</div>

              {/* 关联订单信息 */}
              {order && (
                <div className="bg-blue-50 rounded-xl px-3 py-2 mb-3 text-xs text-blue-700">
                  关联订单：{order.from} → {order.to} · ¥{order.price} · {order.passengerName}
                </div>
              )}

              {c.status === "open" && (
                <div>
                  {selectedC === c.id ? (
                    <div className="mb-3">
                      <textarea value={note} onChange={e => setNote(e.target.value)}
                        placeholder="输入处理备注..." rows={2}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-300 resize-none" />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => store.resolveComplaint(c.id)}
                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />标记已解决
                    </button>
                    <button onClick={() => setSelectedC(selectedC === c.id ? null : c.id)}
                      className="px-3 py-1.5 border border-blue-200 rounded-lg text-xs text-blue-600 flex items-center gap-1">
                      <Edit className="w-3 h-3" />添加备注
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">联系乘客</button>
                    {driver && <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">联系司机</button>}
                    <button className="px-3 py-1.5 border border-violet-200 rounded-lg text-xs text-violet-600">分配客服</button>
                    <button onClick={() => { store.cancelOrder(c.orderId); store.resolveComplaint(c.id); }}
                      className="px-3 py-1.5 border border-rose-200 rounded-lg text-xs text-rose-500">申请退款</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {store.complaints.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 text-sm shadow-sm border">
            <div className="text-3xl mb-2">✅</div>暂无工单
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   数据分析
   ============================================================ */
function AnalyticsPage({ store }: any) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const completed = store.orders.filter((o: any) => o.status === "completed");
  const gmv = completed.reduce((s: number, o: any) => s + o.price, 0);
  const cancelled = store.orders.filter((o: any) => o.status === "cancelled").length;
  const completeRate = store.orders.length > 0 ? Math.round(completed.length / store.orders.length * 100) : 0;

  const hourlyData = [3, 8, 12, 15, 22, 31, 45, 58, 42, 38, 35, 40, 52, 48, 44, 39, 46, 61, 72, 68, 55, 42, 28, 14];
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const weekRevenue = [1250, 1680, 1420, 1890, 2100, 2450, 1980];

  return (
    <div className="space-y-5">
      {/* 核心指标 */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">数据分析概览</div>
        <div className="flex gap-1.5">
          {[["day", "今日"], ["week", "本周"], ["month", "本月"]].map(([k, l]) => (
            <button key={k} onClick={() => setPeriod(k as any)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${period === k ? "bg-slate-900 text-white" : "bg-white text-gray-600 border"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "订单量", val: store.orders.length, delta: "+18.2%", up: true, icon: "📦", color: "text-orange-500" },
          { label: "GMV", val: `¥${(gmv * (period === "week" ? 7 : period === "month" ? 30 : 1) + 1280).toFixed(0)}`, delta: "+12.5%", up: true, icon: "💰", color: "text-emerald-500" },
          { label: "完单率", val: `${completeRate}%`, delta: "+2.1%", up: true, icon: "✅", color: "text-blue-500" },
          { label: "取消率", val: `${Math.round(cancelled / Math.max(store.orders.length, 1) * 100)}%`, delta: "-0.8%", up: false, icon: "❌", color: "text-rose-500" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{c.label}</span>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className={`text-xl font-bold ${c.color} mb-1`}>{c.val}</div>
            <div className={`text-xs flex items-center gap-0.5 ${c.up ? "text-emerald-500" : "text-rose-500"}`}>
              {c.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{c.delta}
            </div>
          </div>
        ))}
      </div>

      {/* 24小时订单分布 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-800 mb-4">24小时订单分布</div>
        <div className="flex items-end gap-0.5 h-24">
          {hourlyData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className={`w-full rounded-t ${v > 50 ? "bg-orange-500" : v > 30 ? "bg-orange-300" : "bg-orange-100"} min-h-[2px]`}
                style={{ height: `${v * 0.85}px` }} />
              {i % 3 === 0 && <div className="text-[8px] text-gray-400">{i}h</div>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />高峰期</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-300 inline-block" />正常</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-100 inline-block" />低峰</span>
        </div>
      </div>

      {/* 本周收入 + 车型占比 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-800 mb-4">本周收入趋势</div>
          <div className="flex items-end gap-2 h-32">
            {weekRevenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-gray-500 mb-0.5">¥{v}</div>
                <div className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-teal-400"
                  style={{ height: `${(v / 2500) * 96}px` }} />
                <div className="text-[10px] text-gray-400">{days[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-800 mb-3">用户分布</div>
          {[
            { label: "新用户(首单)", val: 28, color: "bg-violet-500" },
            { label: "活跃用户", val: 54, color: "bg-blue-500" },
            { label: "沉默用户", val: 18, color: "bg-gray-300" },
          ].map(x => (
            <div key={x.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{x.label}</span>
                <span className="font-medium">{x.val}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${x.color} rounded-full`} style={{ width: `${x.val}%` }} />
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t">
            <div className="text-xs font-medium text-gray-700 mb-2">转化漏斗</div>
            {[
              { label: "打开APP", val: "100%", w: 100 },
              { label: "搜索目的地", val: "68%", w: 68 },
              { label: "确认下单", val: "45%", w: 45 },
              { label: "完成行程", val: "38%", w: 38 },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 mb-1.5">
                <div className="text-[10px] text-gray-500 w-16 flex-shrink-0">{f.label}</div>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${f.w}%` }} />
                </div>
                <span className="text-[10px] text-gray-500 w-6">{f.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 司机效率分析 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-800 mb-3">司机效率对比</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b">
              <th className="text-left py-2 font-normal">司机</th>
              <th className="text-left font-normal">完单率</th>
              <th className="text-left font-normal">时均收入</th>
              <th className="text-left font-normal">好评率</th>
              <th className="text-left font-normal">在线时长</th>
              <th className="text-left font-normal">综合评分</th>
            </tr>
          </thead>
          <tbody>
            {store.drivers.map((d: any) => {
              const dr = store.orders.filter((o: any) => o.driverId === d.id);
              const comp = dr.filter((o: any) => o.status === "completed").length;
              const compRate = dr.length > 0 ? Math.round(comp / dr.length * 100) : 0;
              return (
                <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">👨‍✈️</span>
                      <span className="text-xs text-gray-800">{d.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${compRate || 95}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{compRate || 95}%</span>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-emerald-600">¥{(d.todayEarnings / 6.2).toFixed(0)}/h</td>
                  <td className="text-xs text-blue-600">98%</td>
                  <td className="text-xs text-gray-600">6.2h</td>
                  <td>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500"><Star className="w-3 h-3 fill-current" />{d.rating}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   营销活动
   ============================================================ */
function MarketingPage({ store }: any) {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "ended">("active");
  const [issuingCoupon, setIssuingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ amount: 5, minOrder: 10, type: "全部车型", expireDate: "2026-06-01", tag: "" });

  const campaigns = {
    active: [
      { id: "M001", name: "新人首单五折", type: "折扣", budget: 50000, used: 32400, limit: 10000, endDate: "2026-05-01", status: "进行中", reach: 8231 },
      { id: "M002", name: "周末立减8元", type: "立减", budget: 20000, used: 14560, limit: null, endDate: "2026-04-27", status: "进行中", reach: 5123 },
      { id: "M003", name: "邀好友得88元", type: "裂变", budget: 100000, used: 41800, limit: null, endDate: "2026-06-30", status: "进行中", reach: 1021 },
    ],
    draft: [
      { id: "M004", name: "五一出行特惠", type: "折扣", budget: 80000, used: 0, limit: 20000, endDate: "2026-05-05", status: "草稿", reach: 0 },
    ],
    ended: [
      { id: "M005", name: "清明假期9折", type: "折扣", budget: 30000, used: 30000, limit: 8000, endDate: "2026-04-06", status: "已结束", reach: 7892 },
    ],
  };
  const list = campaigns[activeTab];

  const coupons = [
    { name: "5元立减券", type: "立减", amount: 5, used: 18231, total: 50000, exp: "2026-05-31" },
    { name: "8元立减券", type: "立减", amount: 8, used: 6124, total: 10000, exp: "2026-04-30" },
    { name: "9折优惠券", type: "折扣", amount: "9折", used: 4521, total: 20000, exp: "2026-05-15" },
    { name: "新客15元券", type: "立减", amount: 15, used: 892, total: 5000, exp: "2026-05-01" },
  ];

  return (
    <div className="space-y-5">
      {/* 概览数据 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "活动总数", val: 3, sub: "进行中", color: "text-blue-600", bg: "bg-blue-50", icon: "🎯" },
          { label: "券发放量", val: "29,768", sub: "张", color: "text-orange-600", bg: "bg-orange-50", icon: "🎟" },
          { label: "活动参与人数", val: "14,375", sub: "人", color: "text-violet-600", bg: "bg-violet-50", icon: "👥" },
          { label: "营销成本", val: "¥88,760", sub: "本月", color: "text-rose-600", bg: "bg-rose-50", icon: "💸" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-500">{c.label}</div>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className={`text-xl font-bold ${c.color}`}>{c.val}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* 发券面板 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button onClick={() => setIssuingCoupon(!issuingCoupon)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-orange-50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-sm">🎟</div>
            <div className="text-sm font-medium">向用户批量发放优惠券</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">快捷发券</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${issuingCoupon ? "rotate-180" : ""}`} />
          </div>
        </button>
        {issuingCoupon && (
          <div className="p-4 border-t bg-orange-50/30 grid grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">券面额(元)</div>
              <input type="number" value={newCoupon.amount} onChange={e => setNewCoupon(p => ({ ...p, amount: +e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">最低消费</div>
              <input type="number" value={newCoupon.minOrder} onChange={e => setNewCoupon(p => ({ ...p, minOrder: +e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">适用车型</div>
              <select value={newCoupon.type} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400">
                {["全部车型", "特惠快车", "顺风车", "专车"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">过期日期</div>
              <input type="date" value={newCoupon.expireDate} onChange={e => setNewCoupon(p => ({ ...p, expireDate: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div className="col-span-3">
              <div className="text-xs text-gray-500 mb-1">标签(选填)</div>
              <input placeholder="如：新人、周末专享..." value={newCoupon.tag} onChange={e => setNewCoupon(p => ({ ...p, tag: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div className="flex flex-col justify-end">
              <button onClick={() => {
                store.addUserCoupon({ amount: newCoupon.amount, minOrder: newCoupon.minOrder, type: newCoupon.type, expireDate: newCoupon.expireDate, tag: newCoupon.tag || undefined });
                setIssuingCoupon(false);
              }} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2 rounded-lg text-sm font-medium">
                ✓ 确认发放
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 活动列表 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">活动管理</div>
          <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />新建活动
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          {[["active", "进行中"], ["draft", "草稿"], ["ended", "已结束"]].map(([k, l]) => (
            <button key={k} onClick={() => setActiveTab(k as any)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${activeTab === k ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"}`}>{l}</button>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b">
              <th className="text-left py-2 font-normal">活动名称</th>
              <th className="text-left font-normal">类型</th>
              <th className="text-left font-normal">预算使用</th>
              <th className="text-left font-normal">参与人次</th>
              <th className="text-left font-normal">截止日期</th>
              <th className="text-left font-normal">状态</th>
              <th className="text-left font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c: any) => {
              const pct = c.budget > 0 ? Math.round(c.used / c.budget * 100) : 0;
              return (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-xs font-medium text-gray-800">{c.name}</td>
                  <td><span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{c.type}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 80 ? "bg-rose-400" : "bg-orange-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500">{pct}%</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-700">{c.reach.toLocaleString()}</td>
                  <td className="text-xs text-gray-500">{c.endDate}</td>
                  <td>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === "进行中" ? "bg-emerald-100 text-emerald-700" : c.status === "草稿" ? "bg-gray-100 text-gray-600" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-2 text-xs">
                      <button className="text-blue-500 hover:underline">详情</button>
                      {c.status !== "已结束" && <button className="text-gray-400 hover:underline">暂停</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 券库存管理 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">券库存管理</div>
          <button className="text-xs text-blue-500 border border-blue-200 px-3 py-1.5 rounded-lg">批量发放</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {coupons.map((c, i) => (
            <div key={i} className="flex border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 w-20 flex flex-col items-center justify-center text-white">
                <div className="text-[10px] opacity-80">¥</div>
                <div className="text-xl font-bold">{c.amount}</div>
                <div className="text-[9px] opacity-80">{c.type}</div>
              </div>
              <div className="flex-1 p-2.5">
                <div className="text-xs font-medium text-gray-800 mb-1">{c.name}</div>
                <div className="text-[10px] text-gray-400 mb-1.5">到期：{c.exp}</div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.round(c.used / c.total * 100)}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400">{c.used}/{c.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 新发券预览 */}
        {store.userCoupons.filter((c: any) => !c.used).length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-gray-500 mb-2">用户当前可用券 ({store.userCoupons.filter((c: any) => !c.used).length}张)</div>
            <div className="flex flex-wrap gap-1.5">
              {store.userCoupons.filter((c: any) => !c.used).slice(0, 6).map((c: any) => (
                <span key={c.id} className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">
                  ¥{c.amount} {c.type} {c.tag ? `·${c.tag}` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   计价规则
   ============================================================ */
function PricingPage() {
  const [rules, setRules] = useState([
    { name: "特惠快车", base: 12, perKm: 2.2, perMin: 0.5, nightMult: 1.3, surge: 1.0 },
    { name: "舒适型", base: 16, perKm: 3.0, perMin: 0.6, nightMult: 1.3, surge: 1.0 },
    { name: "专车", base: 25, perKm: 4.5, perMin: 0.8, nightMult: 1.5, surge: 1.2 },
    { name: "顺风车", base: 8, perKm: 1.5, perMin: 0.3, nightMult: 1.1, surge: 1.0 },
  ]);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">计价规则配置</div>
          <div className="flex gap-2">
            <button className="text-xs text-gray-500 border rounded-lg px-3 py-1.5">回滚</button>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              className={`text-xs rounded-lg px-3 py-1.5 transition-all ${saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"}`}>
              {saved ? "✓ 已发布" : "发布变更"}
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b">
              <th className="text-left py-2 font-normal">车型</th>
              <th className="text-left font-normal">起步价(元)</th>
              <th className="text-left font-normal">里程费/km</th>
              <th className="text-left font-normal">时长费/min</th>
              <th className="text-left font-normal">夜间倍率</th>
              <th className="text-left font-normal">动态倍率</th>
              <th className="text-left font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.name} className="border-b last:border-0">
                <td className="py-3 text-sm font-medium text-gray-800">{r.name}</td>
                <td><input type="number" value={r.base} onChange={e => setRules(rs => rs.map((x, j) => j === i ? { ...x, base: +e.target.value } : x))} className="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:border-slate-400 outline-none" /></td>
                <td><input type="number" step="0.1" value={r.perKm} onChange={e => setRules(rs => rs.map((x, j) => j === i ? { ...x, perKm: +e.target.value } : x))} className="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:border-slate-400 outline-none" /></td>
                <td><input type="number" step="0.1" value={r.perMin} onChange={e => setRules(rs => rs.map((x, j) => j === i ? { ...x, perMin: +e.target.value } : x))} className="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:border-slate-400 outline-none" /></td>
                <td><input type="number" step="0.1" value={r.nightMult} onChange={e => setRules(rs => rs.map((x, j) => j === i ? { ...x, nightMult: +e.target.value } : x))} className="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:border-slate-400 outline-none" /></td>
                <td>
                  <select value={r.surge} onChange={e => setRules(rs => rs.map((x, j) => j === i ? { ...x, surge: +e.target.value } : x))}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-xs outline-none">
                    {[1.0, 1.1, 1.2, 1.3, 1.5, 2.0].map(v => <option key={v} value={v}>{v}x</option>)}
                  </select>
                </td>
                <td><button className="text-xs text-blue-500 hover:underline">保存</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-medium mb-3">一口价规则说明</div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 space-y-1.5">
          {[
            "花小猪核心模式：下单时锁定价格，行程中不因堵车/绕路变化",
            "一口价计算：base_fare + distance_fare + time_fare + dynamic_adjustment，一次性锁定",
            "修改目的地除外：乘客变更终点时重新计价",
            "动态调价（surge）：供需失衡时展示倍数，用户确认后生效",
          ].map(t => (
            <div key={t} className="flex items-start gap-2"><span className="text-blue-500 flex-shrink-0">•</span>{t}</div>
          ))}
        </div>
      </div>

      {/* 调价历史 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-medium mb-3">最近调价记录</div>
        {[
          { time: "2026-04-22 14:30", op: "admin", rule: "特惠快车", field: "里程费", from: "2.0", to: "2.2" },
          { time: "2026-04-20 10:15", op: "admin", rule: "专车", field: "夜间倍率", from: "1.3", to: "1.5" },
          { time: "2026-04-18 09:00", op: "admin", rule: "顺风车", field: "起步价", from: "7", to: "8" },
        ].map((r, i) => (
          <div key={i} className="flex justify-between items-center py-2.5 border-b last:border-0 text-xs">
            <div className="text-gray-500">{r.time}</div>
            <div className="text-gray-700">{r.rule} · {r.field}</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{r.from}</span>
              <span className="text-gray-400">→</span>
              <span className="text-emerald-600 font-medium">{r.to}</span>
            </div>
            <span className="text-gray-400">by {r.op}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
