#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;

use rocket::response::NamedFile;

use std::{
    io, path::{Path, PathBuf},
};

const PUBLIC: &'static str = "public/";
const INDEX_HTML: &'static str = "public/index.html";

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open(INDEX_HTML)
}

#[get("/<file..>")]
fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new(PUBLIC).join(file)).ok()
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, files])
        .launch();
}
