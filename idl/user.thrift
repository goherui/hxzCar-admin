namespace go hxzcar.user

include "base.thrift"

struct User {
    1: i64 id,
    2: string username,
    3: string phone,
    4: string role,
    5: i32 status,
    6: string created_at,
}

struct RegisterReq {
    1: string username,
    2: string phone,
    3: string password,
    4: string role,
}

struct RegisterResp {
    1: User user,
    255: base.BaseResp baseResp,
}

struct GetUserReq {
    1: i64 user_id,
}

struct GetUserResp {
    1: User user,
    255: base.BaseResp baseResp,
}

service UserService {
    RegisterResp Register(1: RegisterReq req),
    GetUserResp GetUser(1: GetUserReq req),
}