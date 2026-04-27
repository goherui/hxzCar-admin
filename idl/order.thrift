namespace go hxzcar.order

include "base.thrift"

struct Order {
    1: i64 order_id,
    2: string order_no,
    3: i64 passenger_id,
    4: i64 driver_id,
    5: string start_addr,
    6: string end_addr,
    7: double start_lat,
    8: double start_lng,
    9: double end_lat,
    10: double end_lng,
    11: string car_type,
    12: double origin_amount,
    13: double discount_amount,
    14: double final_amount,
    15: i32 status,        // 0:待接单 1:已接单 2:行程中 3:待支付 4:已完成 5:已取消
    16: double distance,    // 距离（公里）
    17: i32 estimated_time, // 预估时长（分钟）
    18: string create_time,
    19: string pickup_time,
    20: string start_time,
    21: string end_time,
    22: string cancel_time,
    23: string cancel_reason,
    24: string driver_name,     // 司机姓名
    25: string driver_phone,    // 司机电话
    26: string passenger_name,  // 乘客姓名
    27: string passenger_phone, // 乘客电话
}

struct OrderStatusLog {
    1: i64 id,
    2: i64 order_id,
    3: string order_no,
    4: i32 status,
    5: string operator_type,
    6: i64 operator_id,
    7: string remark,
    8: string create_time,
}

struct CreateOrderReq {
    1: i64 passenger_id,
    2: string start_addr,
    3: string end_addr,
    4: double start_lat,
    5: double start_lng,
    6: double end_lat,
    7: double end_lng,
    8: string car_type,
}

struct CreateOrderResp {
    1: Order order,
    255: base.BaseResp baseResp,
}

struct GetOrderReq {
    1: i64 order_id,
}

struct GetOrderResp {
    1: Order order,
    2: list<OrderStatusLog> status_logs,
    255: base.BaseResp baseResp,
}

struct ListOrderReq {
    1: string order_no,
    2: string driver_name,
    3: string passenger_name,
    4: i32 page,
    5: i32 page_size,
}

struct ListOrderResp {
    1: list<Order> orders,
    2: i64 total,
    255: base.BaseResp baseResp,
}

struct AssignDriverReq {
    1: i64 order_id,
    2: i64 driver_id,
}

struct AssignDriverResp {
    1: Order order,
    255: base.BaseResp baseResp,
}

service OrderService {
    CreateOrderResp CreateOrder(1: CreateOrderReq req),
    GetOrderResp GetOrder(1: GetOrderReq req),
    ListOrderResp ListOrder(1: ListOrderReq req),
    AssignDriverResp AssignDriver(1: AssignDriverReq req),
}