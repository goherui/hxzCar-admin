package main

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	base "hxzCar-admin/kitex_gen/hxzcar/base"
	passenger "hxzCar-admin/kitex_gen/hxzcar/passenger"

	_ "github.com/go-sql-driver/mysql"
)

// calculateMemberLevel 根据累计消费金额计算会员等级
func calculateMemberLevel(totalAmount float64) string {
	switch {
	case totalAmount >= 10000:
		return "钻石"
	case totalAmount >= 5000:
		return "白金"
	case totalAmount >= 1000:
		return "黄金"
	case totalAmount >= 100:
		return "白银"
	default:
		return "普通"
	}
}

type PassengerServiceImpl struct {
	db *sql.DB
}

func (s *PassengerServiceImpl) InitDB() error {
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

func (s *PassengerServiceImpl) ListPassenger(ctx context.Context, req *passenger.ListPassengerReq) (resp *passenger.ListPassengerResp, err error) {
	var conditions []string
	var args []interface{}

	if req.Phone != "" {
		conditions = append(conditions, "phone LIKE ?")
		args = append(args, "%"+req.Phone+"%")
	}

	if req.Nickname != "" {
		conditions = append(conditions, "nickname LIKE ?")
		args = append(args, "%"+req.Nickname+"%")
	}

	baseQuery := "FROM passenger"
	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) %s %s", baseQuery, whereClause)
	var total int64
	err = s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, err
	}

	page := req.Page
	if page <= 0 {
		page = 1
	}

	pageSize := req.PageSize
	if pageSize <= 0 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	selectQuery := fmt.Sprintf(`
		SELECT passenger.id, passenger.nickname, passenger.phone, passenger.avatar, passenger.status, passenger.create_time,
		       COALESCE(COUNT(order_main.id), 0) as total_orders,
		       COALESCE(SUM(order_main.final_amount), 0) as total_amount
		%s 
		LEFT JOIN order_main ON passenger.id = order_main.passenger_id
		%s
		GROUP BY passenger.id, passenger.nickname, passenger.phone, passenger.avatar, passenger.status, passenger.create_time
		ORDER BY passenger.create_time DESC
		LIMIT ? OFFSET ?
	`, baseQuery, whereClause)

	args = append(args, pageSize, offset)
	rows, err := s.db.Query(selectQuery, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var passengers []*passenger.Passenger
	for rows.Next() {
		var p passenger.Passenger
		var nickname, avatar sql.NullString
		var totalOrders int64
		var totalAmount float64

		err := rows.Scan(
			&p.Id,
			&nickname,
			&p.Phone,
			&avatar,
			&p.Status,
			&p.CreatedAt,
			&totalOrders,
			&totalAmount,
		)
		if err != nil {
			return nil, err
		}

		if nickname.Valid {
			p.Nickname = nickname.String
		} else {
			p.Nickname = ""
		}

		if avatar.Valid {
			p.Avatar = avatar.String
		} else {
			p.Avatar = ""
		}

		// 计算会员等级
		p.TotalOrders = totalOrders
		p.TotalAmount = totalAmount
		p.MemberLevel = calculateMemberLevel(totalAmount)

		passengers = append(passengers, &p)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	resp = &passenger.ListPassengerResp{
		Passengers: passengers,
		Total:      total,
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}

	return resp, nil
}

func (s *PassengerServiceImpl) GetPassenger(ctx context.Context, req *passenger.GetPassengerReq) (resp *passenger.GetPassengerResp, err error) {
	query := `
		SELECT p.id, p.nickname, p.phone, p.avatar, p.status, p.create_time,
		       COALESCE(COUNT(o.id), 0) as total_orders,
		       COALESCE(SUM(o.final_amount), 0) as total_amount
		FROM passenger p
		LEFT JOIN order_main o ON p.id = o.passenger_id
		WHERE p.id = ?
		GROUP BY p.id, p.nickname, p.phone, p.avatar, p.status, p.create_time
	`

	row := s.db.QueryRow(query, req.PassengerId)
	var p passenger.Passenger
	var nickname, avatar sql.NullString
	var totalOrders int64
	var totalAmount float64

	err = row.Scan(
		&p.Id,
		&nickname,
		&p.Phone,
		&avatar,
		&p.Status,
		&p.CreatedAt,
		&totalOrders,
		&totalAmount,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return &passenger.GetPassengerResp{
				Passenger: nil,
				BaseResp: &base.BaseResp{
					Code: "404",
					Msg:  "Passenger not found",
				},
			}, nil
		}
		return nil, err
	}

	if nickname.Valid {
		p.Nickname = nickname.String
	} else {
		p.Nickname = ""
	}

	if avatar.Valid {
		p.Avatar = avatar.String
	} else {
		p.Avatar = ""
	}

	// 计算会员等级
	p.TotalOrders = totalOrders
	p.TotalAmount = totalAmount
	p.MemberLevel = calculateMemberLevel(totalAmount)

	resp = &passenger.GetPassengerResp{
		Passenger: &p,
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}

	return resp, nil
}

func (s *PassengerServiceImpl) UpdateBalance(ctx context.Context, req *passenger.UpdateBalanceReq) (resp *passenger.UpdateBalanceResp, err error) {
	// 更新余额
	_, err = s.db.Exec(
		"UPDATE passenger SET balance = balance + ? WHERE id = ?",
		req.Amount, req.PassengerId,
	)
	if err != nil {
		return &passenger.UpdateBalanceResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Failed to update balance: " + err.Error(),
			},
		}, nil
	}

	return &passenger.UpdateBalanceResp{
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}, nil
}

func (s *PassengerServiceImpl) BanAccount(ctx context.Context, req *passenger.BanAccountReq) (resp *passenger.BanAccountResp, err error) {
	// 更新账户状态
	status := 1
	if req.Banned {
		status = 0
	}

	_, err = s.db.Exec(
		"UPDATE passenger SET status = ? WHERE id = ?",
		status, req.PassengerId,
	)
	if err != nil {
		return &passenger.BanAccountResp{
			BaseResp: &base.BaseResp{
				Code: "500",
				Msg:  "Failed to update account status: " + err.Error(),
			},
		}, nil
	}

	return &passenger.BanAccountResp{
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}, nil
}

func (s *PassengerServiceImpl) IssueCoupon(ctx context.Context, req *passenger.IssueCouponReq) (resp *passenger.IssueCouponResp, err error) {
	// 暂时跳过发放优惠券的功能，返回成功响应
	// 后续可以根据实际的coupon表结构进行调整
	return &passenger.IssueCouponResp{
		BaseResp: &base.BaseResp{
			Code: "0",
			Msg:  "success",
		},
	}, nil
}
