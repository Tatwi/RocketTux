"""A Python version-independent HTTP server.

For Python 2, this uses the SimpleHTTPServer module. For Python 3, this uses
the http.server module.

Source:
https://github.com/brianhou/fuzzy-octo-ironman/tree/master/simple_server

RocketTux:
Use this script to run a Python web server if you are running Windows.
"""

from __future__ import print_function

import sys
import argparse

def run_server(handler, server, port):
    server_address = ('127.0.0.1', port)
    handler.protocol_version = 'HTTP/1.0'
    httpd = server(server_address, handler)

    sa = httpd.socket.getsockname()
    print('Serving HTTP on', sa[0], 'port', sa[1], '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nKeyboard interrupt received, exiting.')
        httpd.server_close()
        sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description='Start a simple HTTP server.')
    parser.add_argument('-p', '--port', action='store', default=8000, type=int,
                        help='specify alternate port [default: 8000]')
    args = parser.parse_args()

    if sys.version_info.major == 2:
        from SimpleHTTPServer import SimpleHTTPRequestHandler
        from BaseHTTPServer import HTTPServer
    else:
        from http.server import SimpleHTTPRequestHandler, HTTPServer
    run_server(SimpleHTTPRequestHandler, HTTPServer, args.port)

if __name__ == '__main__':
    main()
