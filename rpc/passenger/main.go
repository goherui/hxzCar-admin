package main

import (
	"net"
	passenger "hxzCar-admin/kitex_gen/hxzcar/passenger/passengerservice"
	"log"
	server "github.com/cloudwego/kitex/server"
)

func main() {
	service := new(PassengerServiceImpl)

	// Initialize database
	err := service.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Println("Database initialized successfully")

	// Create server with address
	addr, err := net.ResolveTCPAddr("tcp", ":8890")
	if err != nil {
		log.Fatalf("Failed to resolve address: %v", err)
	}
	svr := passenger.NewServer(service, server.WithServiceAddr(addr))

	log.Println("Server started on :8890")
	err = svr.Run()

	if err != nil {
		log.Println(err.Error())
	}
}
