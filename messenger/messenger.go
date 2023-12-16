package main

import (
	"log"
	"net/http"
)

// TODAY
// - Read on how to create a http server in go
// - Read up on websockets

// CONNECTION HANDLER

// 1) Create HTTP Server
// func initiateWebSocket(w http.ResponseWriter, r *http.Request) {
//
// 	// Concatenate Sec-WebScoket-Key with salt
// 	securityKey := r.Header.Get("Sec-WebSocket-Key") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
// 	fmt.Println(securityKey)
//
// 	// Create hash using sha1
// 	h := sha1.New()
// 	io.WriteString(h, securityKey)
// 	hash := h.Sum(nil)
//
// 	// Create a buffer to hold the encoded data
// 	var buf bytes.Buffer
//
// 	// Convert to base64 and store in string
// 	encoder := base64.NewEncoder(base64.StdEncoding, &buf)
// 	encoder.Write(hash)
// 	encoder.Close()
// 	encodedString := buf.String()
//
// 	// Add required headers and send to client
// 	w.Header().Add("Sec-WebSocket-Accept", encodedString)
// 	w.Header().Add("Connection", "upgrade")
// 	w.WriteHeader(101)
//
// 	w.Write([]byte(("Connected to go server!")))
// }

func handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
}

func main() {
	http.HandleFunc("/ws", handler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

// 2) Accept incoming connection

// MESSAGE ROUTER

// 1) Receive incoming message

// 2) Save to database

// 3) Distribute message to all members of that group
