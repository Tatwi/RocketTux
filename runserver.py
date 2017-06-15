import SimpleHTTPServer
import SocketServer
import socket

# Get local IP address
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
IP = s.getsockname()[0]
s.close()

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

here = 'Serving this folder at ' + str(IP) + ':' + str(PORT)

print here 
httpd.serve_forever()
