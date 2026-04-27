package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	base "hxzCar-admin/rpc/order/kitex_gen/hxzcar/base"
	order "hxzCar-admin/rpc/order/kitex_gen/hxzcar/order"

	_ "github.com/go-sql-driver/mysql"
)

// OrderServiceImpl implements the last service interface defined in the IDL.
type OrderServiceImpl struct {
	db *sql.DB
}

// InitDB initializes the database connection
func (s *OrderServiceImpl) InitDB() error {
	var err error
	s.db, err = sql.Open("mysql", "root:mysql_2SASaZ@tcp(115.190.54.31:3306)/hxzcar-admin?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	s.db.SetMaxOpenConns(25)
	s.db.SetMaxIdleConns(10)
	s.db.SetConnMaxLifetime(5 * time.Minute)

	err = s.db.Ping()
	if err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	return nil
}

// CreateOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) CreateOrder(ctx context.Context, req *order.CreateOrderReq) (resp *order.CreateOrderResp, err error) {
	// TODO: Your code here...
	return
}

// GetOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) GetOrder(ctx context.Context, req *order.GetOrderReq) (resp *order.GetOrderResp, err error) {
	// Build SQL query
	query := `
		SELECT o.id, o.order_no, o.passenger_id, o.driver_id,
		       o.start_addr, o.end_addr, o.start_lng, o.start_lat,
		       o.end_lng, o.end_lat, o.car_type, o.origin_amount,
		       o.discount_amount, o.final_amount, o.status, o.create_time,
		       o.pickup_time, o.start_time, o.end_time, o.cancel_time, o.cancel_reason,
		       d.name as driver_name, d.phone as driver_phone,
		       p.nickname as passenger_name, p.phone as passenger_phone
		FROM order_main o
		LEFT JOIN driver d ON o.driver_id = d.id
		LEFT JOIN passenger p ON o.passenger_id = p.id
		WHERE o.id = ?
	`

	// Execute query
	row := s.db.QueryRow(query, req.OrderId)

	// Process result
	var o order.Order
	var pickupTime, startTime, endTime, cancelTime sql.NullTime
	var driverId sql.NullInt64
	var cancelReason, driverName, driverPhone, passengerName, passengerPhone sql.NullString

	err = row.Scan(
		&o.OrderId, &o.OrderNo, &o.PassengerId, &driverId,
		&o.StartAddr, &o.EndAddr, &o.StartLng, &o.StartLat,
		&o.EndLng, &o.EndLat, &o.CarType, &o.OriginAmount,
		&o.DiscountAmount, &o.FinalAmount, &o.Status, &o.CreateTime,
		&pickupTime, &startTime, &endTime, &cancelTime, &cancelReason,
		&driverName, &driverPhone, &passengerName, &passengerPhone,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return &order.GetOrderResp{
				Order: nil,
				BaseResp: &base.BaseResp{
					Code: "404",
					Msg:  "Order not found",
				},
			}, nil
		}
		return nil, err
	}

	// Handle NULL values
	if driverId.Valid {
		o.DriverId = driverId.Int64
	} else {
		o.DriverId = 0
	}

	if cancelReason.Valid {
		o.CancelReason = cancelReason.String
	} else {
		o.CancelReason = ""
	}

	if driverName.Valid {
		o.DriverName = driverName.String
	} else {
		o.DriverName = ""
	}

	if driverPhone.Valid {
		o.DriverPhone = driverPhone.String
	} else {
		o.DriverPhone = ""
	}

	if passengerName.Valid {
		o.PassengerName = passengerName.String
	} else {
		o.PassengerName = ""
	}

	if passengerPhone.Valid {
		o.PassengerPhone = passengerPhone.String
	} else {
		o.PassengerPhone = ""
	}

	if pickupTime.Valid {
		o.PickupTime = pickupTime.Time.Format("2006-01-02 15:04:05")
	}

	if startTime.Valid {
		o.StartTime = startTime.Time.Format("2006-01-02 15:04:05")
	}

	if endTime.Valid {
		o.EndTime = endTime.Time.Format("2006-01-02 15:04:05")
	}

	if cancelTime.Valid {
		o.CancelTime = cancelTime.Time.Format("2006-01-02 15:04:05")
	}

	// Calculate distance and estimated time using AMap
	if o.StartLng != 0 && o.StartLat != 0 && o.EndLng != 0 && o.EndLat != 0 {
		// Build request parameters
		origins := fmt.Sprintf("%f,%f", o.StartLng, o.StartLat)
		destination := fmt.Sprintf("%f,%f", o.EndLng, o.EndLat)

		// Call AMap distance API
		distance, duration, err := s.mapsDistance(origins, destination, "1") // 1 for driving
		if err == nil {
			o.Distance = float64(distance) / 1000.0 // Convert meters to kilometers
			o.EstimatedTime = int32(duration / 60)  // Convert seconds to minutes
		}
	}

	// Query order status logs
	logsQuery := `
		SELECT id, order_id, order_no, status, operator_type, operator_id, remark, create_time
		FROM order_status_log
		WHERE order_id = ?
		ORDER BY create_time DESC
	`

	rows, err := s.db.Query(logsQuery, req.OrderId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var statusLogs []*order.OrderStatusLog
	for rows.Next() {
		var log order.OrderStatusLog
		var createTime sql.NullTime
		var operatorType, remark sql.NullString
		var operatorId sql.NullInt64

		err := rows.Scan(
			&log.Id, &log.OrderId, &log.OrderNo, &log.Status,
			&operatorType, &operatorId, &remark, &createTime,
		)
		if err != nil {
			return nil, err
		}

		// Handle NULL values
		if operatorType.Valid {
			log.OperatorType = operatorType.String
		} else {
			log.OperatorType = ""
		}

		if operatorId.Valid {
			log.OperatorId = operatorId.Int64
		} else {
			log.OperatorId = 0
		}

		if remark.Valid {
			log.Remark = remark.String
		} else {
			log.Remark = ""
		}

		if createTime.Valid {
			log.CreateTime = createTime.Time.Format("2006-01-02 15:04:05")
		}

		statusLogs = append(statusLogs, &log)
	}

	// Build response
	resp = &order.GetOrderResp{
		Order:      &o,
		StatusLogs: statusLogs,
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}

	return resp, nil
}

// ListOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) ListOrder(ctx context.Context, req *order.ListOrderReq) (resp *order.ListOrderResp, err error) {
	// Build SQL query
	var conditions []string
	var args []interface{}

	if req.OrderNo != "" {
		conditions = append(conditions, "o.order_no LIKE ?")
		args = append(args, "%"+req.OrderNo+"%")
	}

	if req.DriverName != "" {
		conditions = append(conditions, "d.name LIKE ?")
		args = append(args, "%"+req.DriverName+"%")
	}

	if req.PassengerName != "" {
		conditions = append(conditions, "p.nickname LIKE ?")
		args = append(args, "%"+req.PassengerName+"%")
	}

	// Base query
	baseQuery := "FROM order_main o LEFT JOIN driver d ON o.driver_id = d.id LEFT JOIN passenger p ON o.passenger_id = p.id"

	// Build WHERE clause
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " OR ")
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) %s %s", baseQuery, whereClause)
	var total int64
	err = s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, err
	}

	// Calculate offset
	page := req.Page
	if page <= 0 {
		page = 1
	}

	pageSize := req.PageSize
	if pageSize <= 0 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	// Build select query
	selectQuery := fmt.Sprintf(`
		SELECT o.id, o.order_no, o.passenger_id, o.driver_id, 
		       o.start_addr, o.end_addr, o.start_lng, o.start_lat, 
		       o.end_lng, o.end_lat, o.car_type, o.origin_amount, 
		       o.discount_amount, o.final_amount, o.status, o.create_time, 
		       o.pickup_time, o.start_time, o.end_time, o.cancel_time, o.cancel_reason,
		       d.name as driver_name, d.phone as driver_phone,
		       p.nickname as passenger_name, p.phone as passenger_phone
		%s %s
		ORDER BY o.create_time DESC
		LIMIT ? OFFSET ?
	`, baseQuery, whereClause)

	// Add limit and offset to args
	args = append(args, pageSize, offset)

	// Execute query
	rows, err := s.db.Query(selectQuery, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Process results
	var orders []*order.Order
	for rows.Next() {
		var o order.Order
		var pickupTime, startTime, endTime, cancelTime sql.NullTime
		var driverId sql.NullInt64
		var cancelReason, driverName, driverPhone, passengerName, passengerPhone sql.NullString

		err := rows.Scan(
			&o.OrderId, &o.OrderNo, &o.PassengerId, &driverId,
			&o.StartAddr, &o.EndAddr, &o.StartLng, &o.StartLat,
			&o.EndLng, &o.EndLat, &o.CarType, &o.OriginAmount,
			&o.DiscountAmount, &o.FinalAmount, &o.Status, &o.CreateTime,
			&pickupTime, &startTime, &endTime, &cancelTime, &cancelReason,
			&driverName, &driverPhone, &passengerName, &passengerPhone,
		)
		if err != nil {
			return nil, err
		}

		if driverId.Valid {
			o.DriverId = driverId.Int64
		} else {
			o.DriverId = 0
		}

		if cancelReason.Valid {
			o.CancelReason = cancelReason.String
		} else {
			o.CancelReason = ""
		}

		if driverName.Valid {
			o.DriverName = driverName.String
		} else {
			o.DriverName = ""
		}

		if driverPhone.Valid {
			o.DriverPhone = driverPhone.String
		} else {
			o.DriverPhone = ""
		}

		if passengerName.Valid {
			o.PassengerName = passengerName.String
		} else {
			o.PassengerName = ""
		}

		if passengerPhone.Valid {
			o.PassengerPhone = passengerPhone.String
		} else {
			o.PassengerPhone = ""
		}

		if pickupTime.Valid {
			o.PickupTime = pickupTime.Time.Format("2006-01-02 15:04:05")
		}

		if startTime.Valid {
			o.StartTime = startTime.Time.Format("2006-01-02 15:04:05")
		}

		if endTime.Valid {
			o.EndTime = endTime.Time.Format("2006-01-02 15:04:05")
		}

		if cancelTime.Valid {
			o.CancelTime = cancelTime.Time.Format("2006-01-02 15:04:05")
		}

		orders = append(orders, &o)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	// Build response
	resp = &order.ListOrderResp{
		Orders: orders,
		Total:  total,
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}

	return resp, nil
}

// AMapDistanceResponse represents the response from AMap distance API
type AMapDistanceResponse struct {
	Status   string `json:"status"`
	Info     string `json:"info"`
	Infocode string `json:"infocode"`
	Count    string `json:"count"`
	Results  []struct {
		OriginId string `json:"origin_id"`
		DestId   string `json:"dest_id"`
		Distance string `json:"distance"` // in meters
		Duration string `json:"duration"` // in seconds
	} `json:"results"`
}

// mapsDistance calls AMap distance API to calculate distance and duration
func (s *OrderServiceImpl) mapsDistance(origins, destination, distanceType string) (int, int, error) {
	// Build request URL
	url := fmt.Sprintf("https://restapi.amap.com/v3/distance?key=9777d18c3c32efc72d617436a73ccd93&origins=%s&destination=%s&type=%s",
		origins, destination, distanceType)

	// Send request
	resp, err := http.Get(url)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	// Parse response
	var result AMapDistanceResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return 0, 0, err
	}

	// Check if request was successful
	if result.Status != "1" {
		return 0, 0, fmt.Errorf("AMap API error: %s", result.Info)
	}

	// Return the first result
	if len(result.Results) > 0 {
		distance, err := strconv.Atoi(result.Results[0].Distance)
		if err != nil {
			return 0, 0, err
		}
		duration, err := strconv.Atoi(result.Results[0].Duration)
		if err != nil {
			return 0, 0, err
		}
		return distance, duration, nil
	}

	return 0, 0, fmt.Errorf("no results returned from AMap API")
}

// AssignDriver implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) AssignDriver(ctx context.Context, req *order.AssignDriverReq) (resp *order.AssignDriverResp, err error) {
	// Start transaction
	tx, err := s.db.Begin()
	if err != nil {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Check if order exists and is in pending status
	var status int32
	err = tx.QueryRow("SELECT status FROM order_main WHERE id = ?", req.OrderId).Scan(&status)
	if err != nil {
		if err == sql.ErrNoRows {
			return &order.AssignDriverResp{
				BaseResp: &base.BaseResp{
					Code: "404",
					Msg:  "Order not found",
				},
			}, nil
		}
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	if status != 0 {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "400",
				Msg:  "Order is not in pending status",
			},
		}, nil
	}

	// Check if driver exists
	var driverName, driverPhone string
	err = tx.QueryRow("SELECT name, phone FROM driver WHERE id = ?", req.DriverId).Scan(&driverName, &driverPhone)
	if err != nil {
		if err == sql.ErrNoRows {
			return &order.AssignDriverResp{
				BaseResp: &base.BaseResp{
					Code: "404",
					Msg:  "Driver not found",
				},
			}, nil
		}
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	// Update order with driver information
	_, err = tx.Exec(
		"UPDATE order_main SET driver_id = ?, status = 2, pickup_time = NOW(), start_time = NOW() WHERE id = ?",
		req.DriverId, req.OrderId,
	)
	if err != nil {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	// Get order no for status log
	var orderNo string
	err = tx.QueryRow("SELECT order_no FROM order_main WHERE id = ?", req.OrderId).Scan(&orderNo)
	if err != nil {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	// Insert status log
	_, err = tx.Exec(
		"INSERT INTO order_status_log (order_id, order_no, status, operator_type, operator_id, remark, create_time) VALUES (?, ?, 2, 'system', 0, '系统指派司机，开始行程', NOW())",
		req.OrderId, orderNo,
	)
	if err != nil {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	// Query updated order
	var o order.Order
	var pickupTime, startTime, endTime, cancelTime sql.NullTime
	var driverId sql.NullInt64
	var cancelReason, passengerName, passengerPhone sql.NullString

	err = tx.QueryRow(`
		SELECT o.id, o.order_no, o.passenger_id, o.driver_id,
		       o.start_addr, o.end_addr, o.start_lng, o.start_lat,
		       o.end_lng, o.end_lat, o.car_type, o.origin_amount,
		       o.discount_amount, o.final_amount, o.status, o.create_time,
		       o.pickup_time, o.start_time, o.end_time, o.cancel_time, o.cancel_reason,
		       p.nickname as passenger_name, p.phone as passenger_phone
		FROM order_main o
		LEFT JOIN passenger p ON o.passenger_id = p.id
		WHERE o.id = ?
	`, req.OrderId).Scan(
		&o.OrderId, &o.OrderNo, &o.PassengerId, &driverId,
		&o.StartAddr, &o.EndAddr, &o.StartLng, &o.StartLat,
		&o.EndLng, &o.EndLat, &o.CarType, &o.OriginAmount,
		&o.DiscountAmount, &o.FinalAmount, &o.Status, &o.CreateTime,
		&pickupTime, &startTime, &endTime, &cancelTime, &cancelReason,
		&passengerName, &passengerPhone,
	)

	if err != nil {
		return &order.AssignDriverResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Internal server error",
			},
		}, nil
	}

	// Handle NULL values
	if driverId.Valid {
		o.DriverId = driverId.Int64
	} else {
		o.DriverId = 0
	}

	if cancelReason.Valid {
		o.CancelReason = cancelReason.String
	} else {
		o.CancelReason = ""
	}

	o.DriverName = driverName
	o.DriverPhone = driverPhone

	if passengerName.Valid {
		o.PassengerName = passengerName.String
	} else {
		o.PassengerName = ""
	}

	if passengerPhone.Valid {
		o.PassengerPhone = passengerPhone.String
	} else {
		o.PassengerPhone = ""
	}

	if pickupTime.Valid {
		o.PickupTime = pickupTime.Time.Format("2006-01-02 15:04:05")
	}

	if startTime.Valid {
		o.StartTime = startTime.Time.Format("2006-01-02 15:04:05")
	}

	if endTime.Valid {
		o.EndTime = endTime.Time.Format("2006-01-02 15:04:05")
	}

	if cancelTime.Valid {
		o.CancelTime = cancelTime.Time.Format("2006-01-02 15:04:05")
	}

	// Build response
	resp = &order.AssignDriverResp{
		Order: &o,
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}

	return resp, nil
}
