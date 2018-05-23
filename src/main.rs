extern crate ws;
use ws::{listen, Handler, Request, Response, Result, Sender, Handshake, CloseCode, Message};

use std::{
    io::prelude::*,
    fs::File,
    path::Path,
};

const ADDR: &'static str = "0.0.0.0:8080";

static mut NB_CONNECTION: i32 = 0;

struct Server {
    index_html: Vec<u8>,
    main_js: Vec<u8>,
    main_css: Vec<u8>,
    out: Sender,
}

impl Server {
    fn new(out: Sender) -> Self {
        Self {
            out,
            index_html: get_file_content("public/index.html"),
            main_js: get_file_content("public/javascript/main.js"),
            main_css: get_file_content("public/styles/main.css"),
        }
    }
}

fn get_file_content<P: AsRef<Path>>(file: P) -> Vec<u8> {
    let mut f   = File::open(file).expect("can't open static file");
    let mut buf = Vec::new();

    f.read_to_end(&mut buf).expect("can't read static file");
    buf
}

impl Handler for Server {

     fn on_open(&mut self, _shake: Handshake) -> Result<()> {
        println!("new connection");
        unsafe{ NB_CONNECTION += 1; }
        Ok(())
    }

    fn on_close(&mut self, _code: CloseCode, _reason: &str) {
        println!("connection closed");
        unsafe{ NB_CONNECTION -= 1; }
    }

    fn on_request(&mut self, req: &Request) -> Result<(Response)> {
        match req.resource() {
            "/ws" => Response::from_request(req),

            "/status" => {
                let client_number = format!("{{ \"client_number\": {} }}", unsafe{ NB_CONNECTION });
                Ok(Response::new(200, "OK", client_number.into()))
            },

            "/color" => {
                if let Some(color) = req.header("color") {
                    // Expected format is: RRRGGGBBB (as in 255000000, 035127078, ...)
                    let msg = Message::from(color.as_slice());
                    self.out.broadcast(msg)?;
                    Ok(Response::new(200, "OK", vec![]))
                }
                else {
                    // Missing the "color" param in the header
                    Ok(Response::new(422, "Unprocessable Entity", vec![]))
                }
            },

            // ==== Static files
            "/" => Ok(Response::new(200, "OK", self.index_html.clone())),

            "/javascript/main.js" => Ok(Response::new(200, "OK", self.main_js.clone())),

            "/styles/main.css" => Ok(Response::new(200, "OK", self.main_css.clone())),

            _ => Ok(Response::new(404, "Not Found", b"404 - Not Found".to_vec())),
        }
    }
}

fn main() {
    println!("Server running at http://{}", ADDR);
    listen(ADDR, |out| Server::new(out)).unwrap()
}