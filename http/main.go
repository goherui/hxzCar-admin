package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"hxzCar-admin/kitex_gen/hxzcar/order"
	"hxzCar-admin/kitex_gen/hxzcar/order/orderservice"
	"hxzCar-admin/kitex_gen/hxzcar/passenger"
	"hxzCar-admin/kitex_gen/hxzcar/passenger/passengerservice"

	"github.com/cloudwego/kitex/client"
)

// APIResponse 统一API响应结构
type APIResponse struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

// OrderQueryParams 订单查询参数
type OrderQueryParams struct {
	OrderNo       string `json:"order_no"`
	DriverName    string `json:"driver_name"`
	PassengerName string `json:"passenger_name"`
	Page          int    `json:"page"`
	PageSize      int    `json:"page_size"`
}

// OrderListQueryParams 订单列表查询参数（URL查询参数）
type OrderListQueryParams struct {
	OrderNo       string
	DriverName    string
	PassengerName string
	Page          string
	PageSize      string
}

var (
	orderClient     orderservice.Client
	passengerClient passengerservice.Client
)

func init() {
	var err error
	// 初始化Order服务客户端
	orderClient, err = orderservice.NewClient("OrderService", client.WithHostPorts("localhost:8888"))
	if err != nil {
		log.Fatalf("Failed to create order client: %v", err)
	}

	// 初始化Passenger服务客户端
	passengerClient, err = passengerservice.NewClient("PassengerService", client.WithHostPorts("localhost:8890"))
	if err != nil {
		log.Fatalf("Failed to create passenger client: %v", err)
	}
}

// corsMiddleware CORS中间件
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 设置CORS头
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// 处理预检请求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// 创建路由
	mux := http.NewServeMux()

	// 注册路由
	mux.HandleFunc("/api/order/list", handleOrderList)
	mux.HandleFunc("/api/order/detail", handleOrderDetail)
	mux.HandleFunc("/api/order/assign", handleAssignDriver)
	mux.HandleFunc("/api/passenger/list", handlePassengerList)
	mux.HandleFunc("/api/passenger/detail", handlePassengerDetail)
	mux.HandleFunc("/api/passenger/update-balance", handleUpdateBalance)
	mux.HandleFunc("/api/passenger/ban-account", handleBanAccount)
	mux.HandleFunc("/api/passenger/issue-coupon", handleIssueCoupon)

	// 添加CORS中间件
	handler := corsMiddleware(mux)

	// 启动服务器
	log.Println("HTTP server started on :8000")
	err := http.ListenAndServe(":8000", handler)
	if err != nil {
		log.Fatalf("Failed to start HTTP server: %v", err)
	}
}

// handleOrderList 处理订单列表查询
func handleOrderList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	// 获取查询参数
	orderNo := r.URL.Query().Get("order_no")
	driverName := r.URL.Query().Get("driver_name")
	passengerName := r.URL.Query().Get("passenger_name")
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	pageSize := 10
	if pageSizeStr != "" {
		if ps, err := strconv.Atoi(pageSizeStr); err == nil && ps > 0 {
			pageSize = ps
		}
	}

	// 构建请求
	req := &order.ListOrderReq{
		OrderNo:       orderNo,
		DriverName:    driverName,
		PassengerName: passengerName,
		Page:          int32(page),
		PageSize:      int32(pageSize),
	}

	// 调用服务
	resp, err := orderClient.ListOrder(r.Context(), req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	// 构建响应
	apiResp := APIResponse{
		Code: 0,
		Msg:  "success",
		Data: map[string]interface{}{
			"orders": resp.Orders,
			"total":  resp.Total,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handleOrderDetail 处理订单详情查询
func handleOrderDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	// 获取订单ID
	orderIdStr := r.URL.Query().Get("order_id")
	if orderIdStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Order ID is required", Data: nil})
		return
	}

	orderId, err := strconv.ParseInt(orderIdStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid order ID", Data: nil})
		return
	}

	// 构建请求
	req := &order.GetOrderReq{
		OrderId: orderId,
	}

	// 调用服务
	resp, err := orderClient.GetOrder(r.Context(), req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	// 构建响应
	if resp == nil || resp.Order == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(APIResponse{Code: 404, Msg: "Order not found", Data: nil})
		return
	}

	apiResp := APIResponse{
		Code: 0,
		Msg:  "success",
		Data: resp.Order,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handlePassengerList 处理乘客列表查询
func handlePassengerList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	// 获取查询参数
	phone := r.URL.Query().Get("phone")
	nickname := r.URL.Query().Get("nickname")
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	pageSize := 10
	if pageSizeStr != "" {
		if ps, err := strconv.Atoi(pageSizeStr); err == nil && ps > 0 {
			pageSize = ps
		}
	}

	// 构建请求
	req := &passenger.ListPassengerReq{
		Phone:    phone,
		Nickname: nickname,
		Page:     int32(page),
		PageSize: int32(pageSize),
	}

	// 调用服务
	resp, err := passengerClient.ListPassenger(r.Context(), req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	// 构建响应
	apiResp := APIResponse{
		Code: 0,
		Msg:  "success",
		Data: map[string]interface{}{
			"passengers": resp.Passengers,
			"total":      resp.Total,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handleAssignDriver 处理指派司机
func handleAssignDriver(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	var req struct {
		OrderId  int64 `json:"order_id"`
		DriverId int64 `json:"driver_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid request body", Data: nil})
		return
	}

	// 构建请求
	orderReq := &order.AssignDriverReq{
		OrderId:  req.OrderId,
		DriverId: req.DriverId,
	}

	// 调用服务
	resp, err := orderClient.AssignDriver(r.Context(), orderReq)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	code, _ := strconv.Atoi(resp.BaseResp.Code)
	apiResp := APIResponse{
		Code: code,
		Msg:  resp.BaseResp.Msg,
		Data: resp.Order,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handlePassengerDetail 处理乘客详情查询
func handlePassengerDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	passengerIdStr := r.URL.Query().Get("passenger_id")
	if passengerIdStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Passenger ID is required", Data: nil})
		return
	}

	passengerId, err := strconv.ParseInt(passengerIdStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid passenger ID", Data: nil})
		return
	}

	req := &passenger.GetPassengerReq{
		PassengerId: passengerId,
	}

	resp, err := passengerClient.GetPassenger(r.Context(), req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	if resp == nil || resp.Passenger == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(APIResponse{Code: 404, Msg: "Passenger not found", Data: nil})
		return
	}

	apiResp := APIResponse{
		Code: 0,
		Msg:  "success",
		Data: resp.Passenger,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handleUpdateBalance 处理调整余额
func handleUpdateBalance(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	var req struct {
		PassengerId int64   `json:"passenger_id"`
		Amount      float64 `json:"amount"`
		Reason      string  `json:"reason"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid request body", Data: nil})
		return
	}

	passengerReq := &passenger.UpdateBalanceReq{
		PassengerId: req.PassengerId,
		Amount:      req.Amount,
		Reason:      req.Reason,
	}

	resp, err := passengerClient.UpdateBalance(r.Context(), passengerReq)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	code, _ := strconv.Atoi(resp.BaseResp.Code)
	apiResp := APIResponse{
		Code: code,
		Msg:  resp.BaseResp.Msg,
		Data: nil,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handleBanAccount 处理封禁账户
func handleBanAccount(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	var req struct {
		PassengerId int64  `json:"passenger_id"`
		Banned      bool   `json:"banned"`
		Reason      string `json:"reason"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid request body", Data: nil})
		return
	}

	passengerReq := &passenger.BanAccountReq{
		PassengerId: req.PassengerId,
		Banned:      req.Banned,
		Reason:      req.Reason,
	}

	resp, err := passengerClient.BanAccount(r.Context(), passengerReq)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	code, _ := strconv.Atoi(resp.BaseResp.Code)
	apiResp := APIResponse{
		Code: code,
		Msg:  resp.BaseResp.Msg,
		Data: nil,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}

// handleIssueCoupon 处理发放优惠券
func handleIssueCoupon(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(APIResponse{Code: 405, Msg: "Method not allowed", Data: nil})
		return
	}

	var req struct {
		PassengerId  int64  `json:"passenger_id"`
		CouponAmount int32  `json:"coupon_amount"`
		ValidDays    int32  `json:"valid_days"`
		CouponType   string `json:"coupon_type"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(APIResponse{Code: 400, Msg: "Invalid request body", Data: nil})
		return
	}

	passengerReq := &passenger.IssueCouponReq{
		PassengerId:  req.PassengerId,
		CouponAmount: req.CouponAmount,
		ValidDays:    req.ValidDays,
		CouponType:   req.CouponType,
	}

	resp, err := passengerClient.IssueCoupon(r.Context(), passengerReq)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(APIResponse{Code: 500, Msg: "Internal server error", Data: nil})
		return
	}

	code, _ := strconv.Atoi(resp.BaseResp.Code)
	apiResp := APIResponse{
		Code: code,
		Msg:  resp.BaseResp.Msg,
		Data: nil,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResp)
}
