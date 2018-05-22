# Wemos websocket LED Backend

A Rust backend for the wemos LED project, by Clever Cloud. 

Uses websocket with the `wr-rs` rust lib to send color codes to a wemos D1 mini connected to a multicolor LED strip.

## Installation

## Local Setup

Run the project with `cargo run`.

## On Clever Cloud

1. Login to Clever Cloud
2. Create a new Rust app, without add-on
3. Push the project via git to the given clever cloud remote to start the deployment.
4. Create a new domain name or copy the existing one
5. Setup the wemos with the code [you'll find here](https://github.com/CleverCloud/wemos-ws-led).

## Configuration

This software doesn't need configuration. But the wemos does.

As mentionned above, head up to [wemos-ws-led](https://github.com/CleverCloud/wemos-ws-led) project, and clone it locally.
Then change the `WEBSOCKET_HOST` to the domain name of this project (could localhost or the clever cloud sub-domain). Set the port set to `80`, and configure a WPA2 wifi access with Internet with `WIFI_SSID` `WIFI_PASSWORD`.
You'll need the [Arduino IDE](https://www.arduino.cc/en/Main/Software) to upload the code to the wemos.

## Usage

Browse to the domain name, wait for a wemos to connect, and click within the window to send the color to the LED strip.