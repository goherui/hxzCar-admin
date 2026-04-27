# API接口文档

## 一、订单接口

### 1.1 订单列表查询

- **请求方法**：GET
- **请求路径**：`/api/order/list`
- **功能描述**：查询订单列表，支持按订单号、司机姓名、乘客姓名筛选

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| order_no | string | 否 | 订单号 |
| driver_name | string | 否 | 司机姓名 |
| passenger_name | string | 否 | 乘客姓名 |
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页条数，默认10 |

**请求示例**：
```
GET http://localhost:8000/api/order/list?page=1&page_size=10
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data.orders | array | 订单列表 |
| data.total | int | 总条数 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_no": "ORD20260425001",
        "driver_id": 1,
        "driver_name": "李师傅",
        "driver_phone": "13800001001",
        "passenger_id": 1,
        "passenger_name": "张三",
        "passenger_phone": "13911110001",
        "start_address": "北京市朝阳区",
        "end_address": "北京市海淀区",
        "order_amount": 35.50,
        "final_amount": 30.00,
        "status": 1,
        "create_time": "2026-04-25T10:00:00+08:00"
      }
    ],
    "total": 100
  }
}
```

---

### 1.2 订单详情查询

- **请求方法**：GET
- **请求路径**：`/api/order/detail`
- **功能描述**：查询指定订单的详细信息

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| order_id | int64 | 是 | 订单ID |

**请求示例**：
```
GET http://localhost:8000/api/order/detail?order_id=1
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data | object | 订单详情对象 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "order_id": 1,
    "order_no": "ORD20260425001",
    "driver_id": 1,
    "driver_name": "李师傅",
    "driver_phone": "13800001001",
    "passenger_id": 1,
    "passenger_name": "张三",
    "passenger_phone": "13911110001",
    "start_address": "北京市朝阳区",
    "end_address": "北京市海淀区",
    "order_amount": 35.50,
    "final_amount": 30.00,
    "status": 1,
    "create_time": "2026-04-25T10:00:00+08:00"
  }
}
```

---

## 二、乘客接口

### 2.1 乘客列表查询

- **请求方法**：GET
- **请求路径**：`/api/passenger/list`
- **功能描述**：查询乘客列表，支持按手机号、昵称筛选

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 否 | 手机号（支持模糊查询） |
| nickname | string | 否 | 昵称（支持模糊查询） |
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页条数，默认10 |

**请求示例**：
```
GET http://localhost:8000/api/passenger/list?page=1&page_size=10
GET http://localhost:8000/api/passenger/list?phone=139
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data.passengers | array | 乘客列表 |
| data.total | int | 总条数 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "passengers": [
      {
        "id": 1,
        "nickname": "张三",
        "phone": "13911110001",
        "avatar": "https://xxx/avatar1.png",
        "status": 1,
        "create_time": "2026-04-24T14:40:01+08:00",
        "total_orders": 2,
        "total_amount": 200.00,
        "member_level": "白银"
      }
    ],
    "total": 50
  }
}
```

**会员等级说明**：

| 累计消费金额 | 会员等级 |
|-------------|----------|
| 0-99 | 普通 |
| 100-999 | 白银 |
| 1000-4999 | 黄金 |
| 5000-9999 | 白金 |
| 10000+ | 钻石 |

---

### 2.2 乘客详情查询

- **请求方法**：GET
- **请求路径**：`/api/passenger/detail`
- **功能描述**：查询指定乘客的详细信息

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| passenger_id | int64 | 是 | 乘客ID |

**请求示例**：
```
GET http://localhost:8000/api/passenger/detail?passenger_id=1
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data | object | 乘客详情对象 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "nickname": "张三",
    "phone": "13911110001",
    "avatar": "https://xxx/avatar1.png",
    "status": 1,
    "create_time": "2026-04-24T14:40:01+08:00",
    "total_orders": 2,
    "total_amount": 200.00,
    "member_level": "白银"
  }
}
```

---

### 2.3 调整余额

- **请求方法**：POST
- **请求路径**：`/api/passenger/update-balance`
- **功能描述**：调整乘客的余额

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| passenger_id | int64 | 是 | 乘客ID |
| amount | float64 | 是 | 调整金额（正数增加，负数减少） |
| reason | string | 是 | 调整原因 |

**请求示例**：
```
POST http://localhost:8000/api/passenger/update-balance
Content-Type: application/json

{
  "passenger_id": 1,
  "amount": 100,
  "reason": "测试调整余额"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data | null | 无数据返回 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": null
}
```

**错误响应示例**：
```json
{
  "code": 500,
  "msg": "Failed to update balance: ...",
  "data": null
}
```

---

### 2.4 封禁账户

- **请求方法**：POST
- **请求路径**：`/api/passenger/ban-account`
- **功能描述**：封禁或解封乘客账户

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| passenger_id | int64 | 是 | 乘客ID |
| banned | bool | 是 | 是否封禁（true-封禁，false-解封） |
| reason | string | 是 | 操作原因 |

**请求示例**：
```
POST http://localhost:8000/api/passenger/ban-account
Content-Type: application/json

{
  "passenger_id": 1,
  "banned": true,
  "reason": "违规操作"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data | null | 无数据返回 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": null
}
```

---

### 2.5 发放优惠券

- **请求方法**：POST
- **请求路径**：`/api/passenger/issue-coupon`
- **功能描述**：为乘客发放优惠券

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| passenger_id | int64 | 是 | 乘客ID |
| coupon_amount | int32 | 是 | 优惠券金额 |
| valid_days | int32 | 是 | 有效期天数 |
| coupon_type | string | 是 | 优惠券类型（如：满减券、折扣券） |

**请求示例**：
```
POST http://localhost:8000/api/passenger/issue-coupon
Content-Type: application/json

{
  "passenger_id": 1,
  "coupon_amount": 50,
  "valid_days": 7,
  "coupon_type": "满减券"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码，0表示成功 |
| msg | string | 提示信息 |
| data | null | 无数据返回 |

**响应示例**：
```json
{
  "code": 0,
  "msg": "success",
  "data": null
}
```

---

## 三、通用响应说明

### 响应状态码

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 405 | 请求方法不允许 |
| 500 | 服务器内部错误 |

### 通用响应格式

```json
{
  "code": 0,
  "msg": "success",
  "data": null
}
```

---

## 四、服务地址

| 服务 | 地址 |
|------|------|
| HTTP服务 | localhost:8000 |
| Order服务 | localhost:8888 |
| Passenger服务 | localhost:8890 |
