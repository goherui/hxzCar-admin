namespace go hxzcar.passenger

include "base.thrift"

struct Passenger {
    1: i64 id,
    2: string nickname,
    3: string phone,
    4: string avatar,
    5: i32 status,
    6: string created_at,
    7: i64 total_orders,
    8: double total_amount,
    9: string member_level,
}

struct ListPassengerReq {
    1: string phone,
    2: string nickname,
    3: i32 page,
    4: i32 page_size,
}

struct ListPassengerResp {
    1: list<Passenger> passengers,
    2: i64 total,
    255: base.BaseResp baseResp,
}

struct GetPassengerReq {
    1: i64 passenger_id,
}

struct GetPassengerResp {
    1: Passenger passenger,
    255: base.BaseResp baseResp,
}

struct UpdateBalanceReq {
    1: i64 passenger_id,
    2: double amount,
    3: string reason,
}

struct UpdateBalanceResp {
    255: base.BaseResp baseResp,
}

struct BanAccountReq {
    1: i64 passenger_id,
    2: bool banned,
    3: string reason,
}

struct BanAccountResp {
    255: base.BaseResp baseResp,
}

struct IssueCouponReq {
    1: i64 passenger_id,
    2: i32 coupon_amount,
    3: i32 valid_days,
    4: string coupon_type,
}

struct IssueCouponResp {
    255: base.BaseResp baseResp,
}

service PassengerService {
    ListPassengerResp ListPassenger(1: ListPassengerReq req),
    GetPassengerResp GetPassenger(1: GetPassengerReq req),
    UpdateBalanceResp UpdateBalance(1: UpdateBalanceReq req),
    BanAccountResp BanAccount(1: BanAccountReq req),
    IssueCouponResp IssueCoupon(1: IssueCouponReq req),
}
