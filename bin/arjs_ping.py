#!/usr/bin/env python3
# MIT License 2015 Kevin J. Walchko

try:
    import requests
    from progress.bar import Bar
    import socket
except ImportError:
    print("you need to: pip install -U requests progress")
    exit(1)


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        try:
            n = socket.gethostname()
            # make sure it has a zeroconfig .local or you end up
            # with 127.0.0.1 as your address
            if n.find('.local') < 0:
                n += '.local'
            IP = socket.gethostbyname(n)
        except Exception:
            print("*** Can't determine IP address ***")
            raise
    finally:
        s.close()
    return IP


ip = ".".join(get_ip().split(".")[:3]) + "."
comps = {}
maxNum = 250

print("\nSearching for hosts with ArcheyJS " + ip + "2-" + str(maxNum))

bar = Bar(ip + "X", max=maxNum)
for host in range(2, maxNum):
    addr = "http://" + ip + str(host) + ":8080/json"
    try:
        bar.next()
        resp = requests.get(addr, timeout=0.2)
        if resp.status_code == 200:
            comps[resp.json()['hostname']] = resp.json()['network']['IPv4']['address']
        else:
            comps[addr] = "[{}] something there".format(resp.status_code)

    except KeyboardInterrupt:
        exit(0)

    except Exception:
        pass
bar.finish()

if comps:
    print("==========================================")
    for k, v in comps.items():
        print(">> {}: {}".format(k, v))
    print("==========================================")
else:
    print("*** No Pi's found ***")

print(" ")
