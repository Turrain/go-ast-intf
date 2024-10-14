import http.server
import socketserver

PORT = 8009

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/ping':
            # Define the response for the /api/ping request
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            # Return JSON data
            self.wfile.write(b'{"message": "pong"}')
        else:
            # Handle any other paths (404 Not Found)
            self.send_response(404)
            self.end_headers()

# Set up the server
Handler = MyHttpRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()

