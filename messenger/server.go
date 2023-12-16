// Copyright 2015 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore
// +build ignore

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Message struct {
	Message  string `json:"message"`
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
}

// Create map to store connections
type Connections struct {
	mu sync.Mutex
	//	cs []*websocket.Conn
	m map[string]*websocket.Conn
}

var addr = flag.String("addr", "localhost:8080", "http service address")
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
} // use default options
var connections Connections = Connections{m: make(map[string]*websocket.Conn)}

func newConnection(c *websocket.Conn, username string) {

	// Store connection
	connections.mu.Lock()
	connections.m[username] = c
	connections.mu.Unlock()

	for {
		_, message, err := c.ReadMessage()

		fmt.Println(message)

		if err != nil {
			log.Println(err)
			// remove connection form connections
			delete(connections.m, username)
			return
		}

		var msg Message
		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Println(err)
		}

		fmt.Println(msg)

		// add message to database
		fmt.Println(connections.m)

		// send messages to everyone in that group
		for _, value := range connections.m {
			if err := value.WriteMessage(websocket.TextMessage, []byte(msg.Message)); err != nil {
				log.Println(err)
				return
			}

		}

		// is connection closed remove connection from connections

	}

}

func handler(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")

	fmt.Println(username)
	c, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	go newConnection(c, username)

}

func home(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", handler)
	http.HandleFunc("/", home)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
