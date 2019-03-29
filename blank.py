import webapp2

class RedirectToFE(webapp2.RequestHandler):
    def get(self):
        self.redirect("https://www.esportsleague.gg/")

class BlankPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('blank')

app = webapp2.WSGIApplication([
    ('/', RedirectToFE),
    ('/favicon.ico', BlankPage),
], debug=False)
