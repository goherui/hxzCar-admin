// src/app/api.ts

const API_BASE_URL = 'http://localhost:8000';

// 通用请求函数
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// 订单接口
export const orderApi = {
  // 获取订单列表
  getOrderList: async (params: {
    order_no?: string;
    driver_name?: string;
    passenger_name?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    return request<{
      code: number;
      msg: string;
      data: {
        orders: any[];
        total: number;
      };
    }>(`/api/order/list?${queryParams.toString()}`);
  },

  // 获取订单详情
  getOrderDetail: async (orderId: number) => {
    return request<{
      code: number;
      msg: string;
      data: any;
    }>(`/api/order/detail?order_id=${orderId}`);
  },
  assignDriver: async (orderId: number, driverId: number) => {
    return request<{
      code: number;
      msg: string;
      data: any;
    }>('/api/order/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId, driver_id: driverId }),
    });
  },
};

// 乘客接口
export const passengerApi = {
  // 获取乘客列表
  getPassengerList: async (params: {
    phone?: string;
    nickname?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    return request<{
      code: number;
      msg: string;
      data: {
        passengers: any[];
        total: number;
      };
    }>(`/api/passenger/list?${queryParams.toString()}`);
  },

  // 获取乘客详情
  getPassengerDetail: async (passengerId: number) => {
    return request<{
      code: number;
      msg: string;
      data: any;
    }>(`/api/passenger/detail?passenger_id=${passengerId}`);
  },

  // 调整余额
  updateBalance: async (params: {
    passenger_id: number;
    amount: number;
    reason: string;
  }) => {
    return request<{
      code: number;
      msg: string;
      data: null;
    }>('/api/passenger/update-balance', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // 封禁账户
  banAccount: async (params: {
    passenger_id: number;
    banned: boolean;
    reason: string;
  }) => {
    return request<{
      code: number;
      msg: string;
      data: null;
    }>('/api/passenger/ban-account', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // 发放优惠券
  issueCoupon: async (params: {
    passenger_id: number;
    coupon_amount: number;
    valid_days: number;
    coupon_type: string;
  }) => {
    return request<{
      code: number;
      msg: string;
      data: null;
    }>('/api/passenger/issue-coupon', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};
