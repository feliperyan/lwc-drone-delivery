import requests
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

PORT_NUMBER = os.getenv('PORT', 8080)
APP_NAME = os.getenv('HEROKU_APP_NAME', '')
API_KEY_HEROKU = os.getenv('API_KEY_HEROKU', '')


#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
    
    #Handler for the GET requests
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()
        
        link = get_auth_url(API_KEY_HEROKU, APP_NAME)
        payload = '<html><body><a href="' + link + '">link here</a></body></html>'
        
        self.wfile.write(bytes(payload, encoding='utf-8'))
        return


#Create a web server and define the handler to manage the
#incoming request
server = HTTPServer(('', int(PORT_NUMBER)), myHandler)
print ('Started httpserver on port ' , PORT_NUMBER)

#Wait forever for incoming htto requests
server.serve_forever()


def get_auth_url(api_key, app_name):
    heroku_api_releases_list = 'https://api.heroku.com/apps/'+app_name+'/releases'

    header_data = {}
    header_data['Accept'] = 'application/vnd.heroku+json; version=3'
    header_data['Authorization'] = 'Bearer '+api_key

    release = ''
    output_stream_url = ''

    sfdx_scratchie_url = ''

    print('Requesting: ' + heroku_api_releases_list)

    r = requests.get(heroku_api_releases_list, headers=header_data)
    if r.status_code == 200:
        for i in r.json():
            if i.get('output_stream_url', False):
                output_stream_url = i['output_stream_url']
    else:
        return 'ERROR: calling Heroku API: '+str(r.json())

    print('Requesting: ' + output_stream_url)  

    r2 = requests.get(output_stream_url)
    if r2.status_code == 200:
        lines = r2.text.split('\n')
        if len(lines) > 0:
            for l in lines:
                if 'following URL:' in l:
                    sfdx_scratchie_url = l[l.index('https'):]
            if sfdx_scratchie_url == '':
                return 'ERROR: URL for ScratchOrg was not found in output_stream_url. Did you set "show-scratch-org-url: true" within sfdx.yml?'
    else:
        return 'ERROR: getting the output_stream_url from releases failed: '+str(r2.json())

    return sfdx_scratchie_url