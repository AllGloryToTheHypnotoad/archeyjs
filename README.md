# Archeyjs

[![npm](https://img.shields.io/npm/v/archeyjs.svg)](https://github.com/walchko/archeyjs)
[![npm](https://img.shields.io/npm/l/archeyjs.svg)](https://github.com/walchko/archeyjs)

[![NPM](https://nodei.co/npm/archeyjs.png)](https://nodei.co/npm/archeyjs/)

This is a simple archey like clone, which gives system info in a web browser.

Why? I have several Raspberry Pi's doing things and I wanted a simple cross platform way
to see what they are up too.

**still under development**

![](./pics/archeyjs.png)

## Usage

Command line:

    [kevin@Tardis archeyjs]$ node index.js -h
    
    Usage: index archeyjs [options]
    
    Options:
    
      -h, --help         output usage information
      -V, --version      output the version number
      -p, --port <port>  Http server port number

You can connect with a web browser at:

    http://localhost:8080

Or get a json response back by:

    http://localhost:8080/json

Which gives:

    {"platform":"OSX",
    "load":"1.32",
    "release":{"name":"El Capitan","version":"10.11"},
    "uptime":"31:4:57 days:hrs:min",
    "free_memory":"28 MB",
    "total_memory":"8 GB",
    "cpu":"Intel(R) Core(TM)2 Duo CPU     P8600  @ 2.40GHz",
    "arch":"x64",
    "hostname":"Tardis.local",
    "network":{
      "IPv6":{
        "address":"fe80::fa1e:dfff:feea:6820",
        "mac":"f8:1e:df:ea:68:20"
        },
      "IPv4":{
        "address":"192.168.1.3",
        "mac":"f8:1e:df:ea:68:20"
        }
    },
    "timestamp":"2015-11-25T07:05:39.713Z"}

# Install

    npm install -g archeyjs

## Linux Setup

## OSX Setup

# To Do

* include file system
* include better linux distribution identification
* better documentation

# Change Log

* 1.0.0 2015/11/25 Initiated

