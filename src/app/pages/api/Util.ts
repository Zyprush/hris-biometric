import ZKLib from 'node-zklib';

// Function to create and return a ZKLib instance
export function createZKInstance() {
  return new ZKLib('192.168.1.169', 4370, 1000, 4000);
}
