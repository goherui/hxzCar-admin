package main

import (
	"context"
	order "hxzCar-admin/kitex_gen/hxzcar/order"
)

// OrderServiceImpl implements the last service interface defined in the IDL.
type OrderServiceImpl struct{}

// CreateOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) CreateOrder(ctx context.Context, req *order.CreateOrderReq) (resp *order.CreateOrderResp, err error) {
	// TODO: Your code here...
	return
}

// GetOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) GetOrder(ctx context.Context, req *order.GetOrderReq) (resp *order.GetOrderResp, err error) {
	// TODO: Your code here...
	return
}

// ListOrder implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) ListOrder(ctx context.Context, req *order.ListOrderReq) (resp *order.ListOrderResp, err error) {
	// TODO: Your code here...
	return
}

// AssignDriver implements the OrderServiceImpl interface.
func (s *OrderServiceImpl) AssignDriver(ctx context.Context, req *order.AssignDriverReq) (resp *order.AssignDriverResp, err error) {
	// TODO: Your code here...
	return
}
