import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { orderApi } from "./api";

export type OrderStatus =
  | "pending"      // 乘客已下单，等待司机接单
  | "accepted"     // 司机已接单，前往接客
  | "arrived"      // 司机已到达上车点
  | "ongoing"      // 行程中
  | "toPay"        // 待支付
  | "completed"    // 已完成
  | "cancelled";   // 已取消

export interface Order {
  id: string;
  passengerName: string;
  passengerPhone: string;
  from: string;
  to: string;
  distanceKm: number;
  estMinutes: number;
  price: number;
  originalPrice?: number;
  couponId?: string;
  couponDiscount?: number;
  carType: string;
  status: OrderStatus;
  createdAt: number;
  note?: string;
  isPrebook?: boolean;
  prebookTime?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPlate?: string;
  driverCar?: string;
  driverRating?: number;
  paymentMethod?: string;
  rating?: number;
  ratingComment?: string;
  ratingTags?: string[];
  coinsEarned?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  plate: string;
  car: string;
  rating: number;
  online: boolean;
  totalOrders: number;
  todayEarnings: number;
  status: "idle" | "busy" | "offline";
}

export interface Complaint {
  id: string;
  orderId: string;
  from: "passenger" | "driver";
  content: string;
  status: "open" | "resolved";
  createdAt: number;
}

export interface UserCoupon {
  id: string;
  amount: number;           // 券面额，e.g. 5 (元)
  minOrder: number;         // 最低消费
  type: string;             // 适用车型
  expireDate: string;       // 过期日期
  tag?: string;             // 标签 e.g. "新人"
  used: boolean;
}

export interface CommonAddress {
  id: string;
  label: "home" | "work" | "school" | "custom";
  name: string;
  address: string;
}

interface Store {
  orders: Order[];
  drivers: Driver[];
  complaints: Complaint[];
  currentDriverId: string;
  userCoupons: UserCoupon[];
  commonAddresses: CommonAddress[];
  walletBalance: number;
  flowerCoins: number;
  createOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => string;
  acceptOrder: (orderId: string, driverId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  payOrder: (orderId: string, method: string, couponId?: string) => void;
  rateOrder: (orderId: string, rating: number, comment: string, tags?: string[]) => void;
  cancelOrder: (orderId: string) => void;
  setDriverOnline: (driverId: string, online: boolean) => void;
  addComplaint: (c: Omit<Complaint, "id" | "createdAt" | "status">) => void;
  resolveComplaint: (id: string) => void;
  banDriver: (id: string) => void;
  useCoupon: (couponId: string) => void;
  addWalletBalance: (amount: number) => void;
  addUserCoupon: (coupon: Omit<UserCoupon, "id" | "used">) => void;
}

const StoreCtx = createContext<Store | null>(null);

const initialDrivers: Driver[] = [
  { id: "D001", name: "王师傅", phone: "138****2341", plate: "苏N·8F23K", car: "轩逸 · 银色", rating: 4.92, online: true, totalOrders: 2341, todayEarnings: 328, status: "idle" },
  { id: "D002", name: "李师傅", phone: "139****6612", plate: "苏N·1K88P", car: "朗逸 · 白色", rating: 4.88, online: true, totalOrders: 1892, todayEarnings: 265, status: "idle" },
  { id: "D003", name: "张师傅", phone: "136****9900", plate: "苏N·2M55Q", car: "捷达 · 黑色", rating: 4.76, online: false, totalOrders: 985, todayEarnings: 0, status: "offline" },
  { id: "D004", name: "赵师傅", phone: "135****4411", plate: "苏N·6R23L", car: "卡罗拉 · 白色", rating: 4.95, online: true, totalOrders: 3102, todayEarnings: 412, status: "idle" },
];

const initialOrders: Order[] = [
  { id: "20260423001", passengerName: "我", passengerPhone: "198****2059", from: "宿迁职业技术学院8号楼南侧", to: "宿迁万达广场", distanceKm: 6.2, estMinutes: 18, price: 11.2, originalPrice: 17.2, couponDiscount: 6, carType: "小猪特价", status: "completed", createdAt: Date.now() - 3600000 * 3, driverId: "D001", driverName: "王师傅", driverPlate: "苏N·8F23K", driverCar: "轩逸 · 银色", driverRating: 4.92, paymentMethod: "微信支付", rating: 5, ratingComment: "师傅很准时", ratingTags: ["准时准点", "车内整洁"], coinsEarned: 22 },
  { id: "20260422002", passengerName: "我", passengerPhone: "198****2059", from: "宿迁高铁站", to: "宿迁职业技术学院8号楼南侧", distanceKm: 12.5, estMinutes: 28, price: 21.8, originalPrice: 26.8, couponDiscount: 5, carType: "小猪特价", status: "completed", createdAt: Date.now() - 86400000, driverId: "D002", driverName: "李师傅", driverPlate: "苏N·1K88P", driverCar: "朗逸 · 白色", driverRating: 4.88, paymentMethod: "微信支付", rating: 5, ratingComment: "路线很熟悉", coinsEarned: 43 },
  { id: "20260420003", passengerName: "我", passengerPhone: "198****2059", from: "宿迁人民医院", to: "宿迁中央商务区", distanceKm: 4.8, estMinutes: 14, price: 9.2, carType: "小猪特价", status: "cancelled", createdAt: Date.now() - 86400000 * 3 },
  { id: "20260423004", passengerName: "用户8821", passengerPhone: "138****0002", from: "宿迁万达广场", to: "宿迁高铁站", distanceKm: 8.2, estMinutes: 22, price: 24.0, carType: "特惠快车", status: "ongoing", createdAt: Date.now() - 600000, driverId: "D002", driverName: "李师傅", driverPlate: "苏N·1K88P", driverCar: "朗逸 · 白色", driverRating: 4.88 },
  { id: "20260423005", passengerName: "用户1109", passengerPhone: "138****0003", from: "宿迁市政府广场", to: "宿迁学院北门", distanceKm: 12.8, estMinutes: 28, price: 36.5, carType: "舒适型", status: "pending", createdAt: Date.now() - 120000 },
];

const initialComplaints: Complaint[] = [
  { id: "C001", orderId: "20260423004", from: "passenger", content: "司机绕路了2公里", status: "open", createdAt: Date.now() - 7200000 },
  { id: "C002", orderId: "20260422002", from: "passenger", content: "车内有异味，体验不佳", status: "resolved", createdAt: Date.now() - 86400000 },
];

const initialCoupons: UserCoupon[] = [
  { id: "CPN001", amount: 6, minOrder: 10, type: "特惠快车", expireDate: "2026-05-01", tag: "新人", used: false },
  { id: "CPN002", amount: 8, minOrder: 20, type: "全部车型", expireDate: "2026-04-30", used: false },
  { id: "CPN003", amount: 5, minOrder: 10, type: "顺风车", expireDate: "2026-04-28", used: false },
  { id: "CPN004", amount: 3, minOrder: 10, type: "全部车型", expireDate: "2026-05-15", used: false },
  { id: "CPN005", amount: 15, minOrder: 50, type: "专车", expireDate: "2026-05-10", tag: "VIP", used: false },
  { id: "CPN006", amount: 5, minOrder: 10, type: "全部车型", expireDate: "已过期 04-01", used: true },
  { id: "CPN007", amount: 10, minOrder: 30, type: "全部车型", expireDate: "已使用 04-21", used: true },
];

const initialAddresses: CommonAddress[] = [
  { id: "A001", label: "home", name: "家", address: "宿迁职业技术学院8号楼南侧" },
  { id: "A002", label: "work", name: "公司", address: "宿迁中央商务区" },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>(initialCoupons);
  const [commonAddresses] = useState<CommonAddress[]>(initialAddresses);
  const [walletBalance, setWalletBalance] = useState(36.0);
  const [flowerCoins, setFlowerCoins] = useState(380);
  const [currentDriverId] = useState("D001");

  // 模拟行程进度：接单→到达→行程→待支付的定时推进
  useEffect(() => {
    const t = setInterval(() => {
      setOrders((prev) => prev.map((o) => {
        const age = Date.now() - o.createdAt;
        if (o.status === "accepted" && age > 15000) return { ...o, status: "arrived" };
        if (o.status === "arrived" && age > 30000) return { ...o, status: "ongoing" };
        return o;
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const createOrder: Store["createOrder"] = (o) => {
    const id = "2026" + String(Date.now()).slice(-8);
    setOrders((p) => [{ ...o, id, createdAt: Date.now(), status: "pending" }, ...p]);
    return id;
  };

  const acceptOrder: Store["acceptOrder"] = async (orderId, driverId) => {
    try {
      // 将字符串ID转换为数字
      const numericOrderId = Number(orderId);
      const numericDriverId = Number(driverId);
      
      const response = await orderApi.assignDriver(numericOrderId, numericDriverId);
      if (response.code === 0) {
        const d = drivers.find((x) => x.id === driverId || String(x.id) === driverId);
        if (d) {
          setOrders((p) => p.map((o) => {
            // 匹配订单ID，可能有不同的字段名
            const matches = o.id === orderId || 
                          o.orderId === Number(orderId) || 
                          o.order_id === Number(orderId) ||
                          String(o.id) === orderId ||
                          String(o.orderId) === orderId ||
                          String(o.order_id) === orderId;
                          
            if (matches) {
              return {
                ...o, 
                status: "ongoing", 
                driverId, 
                driverName: d.name,
                driverPhone: d.phone, 
                driverPlate: d.plate, 
                driverCar: d.car, 
                driverRating: d.rating,
                createdAt: Date.now(),
              };
            }
            return o;
          }));
          setDrivers((p) => p.map((x) => x.id === driverId || String(x.id) === driverId ? { ...x, status: "busy" } : x));
        }
      }
    } catch (error) {
      console.error("指派司机失败:", error);
      throw error; // 重新抛出错误，让调用者处理
    }
  };

  const updateOrderStatus: Store["updateOrderStatus"] = (orderId, status) => {
    setOrders((p) => p.map((o) => o.id === orderId ? { ...o, status } : o));
    if (status === "completed" || status === "cancelled") {
      setOrders((prev) => {
        const o = prev.find((x) => x.id === orderId);
        if (o?.driverId) {
          setDrivers((d) => d.map((x) => x.id === o.driverId ? {
            ...x, status: "idle",
            todayEarnings: x.todayEarnings + (status === "completed" ? o.price : 0),
            totalOrders: x.totalOrders + (status === "completed" ? 1 : 0)
          } : x));
        }
        return prev;
      });
    }
  };

  const payOrder: Store["payOrder"] = (orderId, method, couponId) => {
    setOrders((p) => p.map((o) => {
      if (o.id !== orderId) return o;
      const coins = Math.floor(o.price * 2); // 每元得2花花币
      return { ...o, status: "completed", paymentMethod: method, couponId, coinsEarned: coins };
    }));
    // 用掉优惠券
    if (couponId) {
      setUserCoupons(prev => prev.map(c => c.id === couponId ? { ...c, used: true } : c));
    }
    // 花花币到账
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const coins = Math.floor(order.price * 2);
      setFlowerCoins(prev => prev + coins);
    }
  };

  const rateOrder: Store["rateOrder"] = (orderId, rating, comment, tags) => {
    setOrders((p) => p.map((o) => o.id === orderId ? { ...o, rating, ratingComment: comment, ratingTags: tags } : o));
  };

  const cancelOrder: Store["cancelOrder"] = (orderId) => updateOrderStatus(orderId, "cancelled");

  const setDriverOnline: Store["setDriverOnline"] = (driverId, online) => {
    setDrivers((p) => p.map((d) => d.id === driverId ? { ...d, online, status: online ? "idle" : "offline" } : d));
  };

  const addComplaint: Store["addComplaint"] = (c) => {
    setComplaints((p) => [{ ...c, id: "C" + Date.now().toString().slice(-4), createdAt: Date.now(), status: "open" }, ...p]);
  };
  const resolveComplaint: Store["resolveComplaint"] = (id) => setComplaints((p) => p.map((c) => c.id === id ? { ...c, status: "resolved" } : c));
  const banDriver: Store["banDriver"] = (id) => setDrivers((p) => p.map((d) => d.id === id ? { ...d, online: false, status: "offline" } : d));
  const useCoupon: Store["useCoupon"] = (couponId) => setUserCoupons(prev => prev.map(c => c.id === couponId ? { ...c, used: true } : c));
  const addWalletBalance: Store["addWalletBalance"] = (amount) => setWalletBalance(prev => prev + amount);
  const addUserCoupon: Store["addUserCoupon"] = (coupon) => {
    const id = "CPN" + Date.now().toString().slice(-6);
    setUserCoupons(prev => [{ ...coupon, id, used: false }, ...prev]);
  };

  return (
    <StoreCtx.Provider value={{
      orders, drivers, complaints, currentDriverId,
      userCoupons, commonAddresses, walletBalance, flowerCoins,
      createOrder, acceptOrder, updateOrderStatus, payOrder, rateOrder,
      cancelOrder, setDriverOnline, addComplaint, resolveComplaint, banDriver,
      useCoupon, addWalletBalance, addUserCoupon,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}

export const statusLabel: Record<OrderStatus, string> = {
  pending: "等待接单", accepted: "司机前往中", arrived: "司机已到达",
  ongoing: "行程中", toPay: "待支付", completed: "已完成", cancelled: "已取消",
};

export const statusColor: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  arrived: "bg-indigo-100 text-indigo-700",
  ongoing: "bg-violet-100 text-violet-700",
  toPay: "bg-pink-100 text-pink-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
};