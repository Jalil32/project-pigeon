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
	Content   string   `json:"content"`
	Recipient []string `json:"recipient"`
	SentFrom  string   `json:"sentFrom"`
	Timestamp int64    `json:"timestamp"`
	Typing    bool     `json:"typing"`
	GroupId   string   `json:"groupId"` // Group ID to identify the target group
}

// Structure to manage group memberships and connections
type GroupConnections struct {
	mu     sync.Mutex
	groups map[string]map[string]*websocket.Conn // groupID to (username to connection)
}

var addr = flag.String("addr", "localhost:8080", "http service address")
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
} // use default options

// Global variable to manage connections
var groupConnections = GroupConnections{
	groups: make(map[string]map[string]*websocket.Conn),
}

func newConnection(c *websocket.Conn, username string, groupId string) {
	// Store connection in the appropriate group
	groupConnections.mu.Lock()
	if _, ok := groupConnections.groups[groupId]; !ok {
		groupConnections.groups[groupId] = make(map[string]*websocket.Conn)
	}
	groupConnections.groups[groupId][username] = c
	groupConnections.mu.Unlock()

	for {
		_, message, err := c.ReadMessage()

		if err != nil {
			log.Println("read error:", err)
			// Remove connection from group
			groupConnections.mu.Lock()
			delete(groupConnections.groups[groupId], username)
			if len(groupConnections.groups[groupId]) == 0 {
				delete(groupConnections.groups, groupId) // Clean up if no more users in the group
			}
			groupConnections.mu.Unlock()
			return
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("unmarshal error:", err)
			continue
		}

		broadcastMessageToGroup(groupId, msg, message)
	}
}

func broadcastMessageToGroup(groupId string, msg Message, rawMessage []byte) {
	groupConnections.mu.Lock()
	defer groupConnections.mu.Unlock()

	for username, conn := range groupConnections.groups[groupId] {
		if username != msg.SentFrom { // Skip the sender
			if err := conn.WriteMessage(websocket.TextMessage, rawMessage); err != nil {
				log.Println("write error:", err)
			}
		}
	}
}

func handler(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	groupId := r.URL.Query().Get("groupId") // Assume groupId is passed as a query parameter

	fmt.Println(r.URL.String())
	if groupId == "" {
		log.Println("groupId must be provided")
		http.Error(w, "groupId must be provided", http.StatusBadRequest)
		return
	}

	fmt.Println("User", username, "connected to group", groupId)
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	go newConnection(c, username, groupId)
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", handler)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
