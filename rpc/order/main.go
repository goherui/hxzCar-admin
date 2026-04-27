package main

import (
	order "hxzCar-admin/rpc/order/kitex_gen/hxzcar/order/orderservice"
	"log"
	"net"

	server "github.com/cloudwego/kitex/server"
)

func main() {
	service := new(OrderServiceImpl)

	// Initialize database
	err := service.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Println("Database initialized successfully")

	// Create server with address
	addr, err := net.ResolveTCPAddr("tcp", ":8888")
	if err != nil {
		log.Fatalf("Failed to resolve address: %v", err)
	}
	svr := order.NewServer(service, server.WithServiceAddr(addr))

	log.Println("Server started on :8888")
	err = svr.Run()

	if err != nil {
		log.Println(err.Error())
	}
}
