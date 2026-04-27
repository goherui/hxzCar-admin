package main

import (
	order "hxzCar-admin/kitex_gen/hxzcar/order/orderservice"
	"log"
)

func main() {
	svr := order.NewServer(new(OrderServiceImpl))

	err := svr.Run()

	if err != nil {
		log.Println(err.Error())
	}
}
