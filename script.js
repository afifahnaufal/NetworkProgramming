function calculateSubnet() {
    const ip = document.getElementById('ip-address').value;
    const cidr = parseInt(document.getElementById('cidr').value);
    const output = document.getElementById('output');
    
    if (!validateIP(ip) || cidr < 1 || cidr > 32) {
        alert('Masukkan IP Address yang valid dan Subnet CIDR antara 1-32.');
        return;
    }

    const subnetMask = getSubnetMask(cidr);
    const networkAddress = calculateNetworkAddress(ip, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, cidr);
    const ipRange = calculateIPRange(networkAddress, broadcastAddress);
    
    document.getElementById('network').textContent = networkAddress;
    document.getElementById('broadcast').textContent = broadcastAddress;
    document.getElementById('range').textContent = ipRange;
    document.getElementById('subnet').textContent = subnetMask;
    
    output.style.display = 'block';
}

function validateIP(ip) {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

function getSubnetMask(cidr) {
    let mask = (0xFFFFFFFF << (32 - cidr)) >>> 0; // Membuat mask dalam bentuk angka
    return formatBinaryToIP(mask);
}

function calculateNetworkAddress(ip, mask) {
    const ipInt = ipToInteger(ip);
    const maskInt = ipToInteger(mask);
    const networkInt = ipInt & maskInt;
    return formatBinaryToIP(networkInt);
}

function calculateBroadcastAddress(network, cidr) {
    const networkInt = ipToInteger(network);
    const hostBits = (1 << (32 - cidr)) - 1; // Menghitung bit untuk host
    const broadcastInt = networkInt | hostBits;
    return formatBinaryToIP(broadcastInt);
}

function calculateIPRange(network, broadcast) {
    const startIP = ipToInteger(network) + 1; // IP pertama (host)
    const endIP = ipToInteger(broadcast) - 1; // IP terakhir (host)
    return `${formatBinaryToIP(startIP)} - ${formatBinaryToIP(endIP)}`;
}

function ipToInteger(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function formatBinaryToIP(value) {
    return [
        (value >>> 24) & 255,
        (value >>> 16) & 255,
        (value >>> 8) & 255,
        value & 255
    ].join('.');
}
