export default {
  interval: null,

  // EmoPulse services
  cpuHistory: [],
  memoryHistory: [],

  // WaitForIt! Linode
  linodeCpuHistory: [],
  linodeMemoryHistory: [],

  start() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      apiServiceStatus.run();
      apiStatusLinode.run();

      // EmoPulse services
      this.pushCPU();
      this.pushMemory();

      // WaitForIt! Linode
      this.pushLinodeCPU();
      this.pushLinodeMemory();
    }, 10000);
  },

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  },

  // -------------------------
  // EMOPULSE SERVICES
  // -------------------------

  pushCPU() {
    const d = apiServiceStatus.data || {};
    const services = Object.keys(d);
    if (!services.length) return;

    const avg = services
      .map(s => d[s]?.cpu || 0)
      .reduce((a, b) => a + b, 0) / services.length;

    this.cpuHistory = [
      ...this.cpuHistory,
      { x: Date.now(), y: avg }
    ].slice(-50);
  },

  pushMemory() {
    const d = apiServiceStatus.data || {};
    const services = Object.keys(d);
    if (!services.length) return;

    const total = services
      .map(s => d[s]?.memoryBytes || 0)
      .reduce((a, b) => a + b, 0);

    this.memoryHistory = [
      ...this.memoryHistory,
      { x: Date.now(), y: total }
    ].slice(-50);
  },

  // -------------------------
  // WaitForIt! LINODE
  // -------------------------

  pushLinodeCPU() {
    const d = apiStatusLinode.data || {};
    if (!d.cpu) return;

    const cpuPercent = d.cpu.user + d.cpu.system;

    this.linodeCpuHistory = [
      ...this.linodeCpuHistory,
      { x: Date.now(), y: cpuPercent }
    ].slice(-50);
  },

  pushLinodeMemory() {
    const d = apiStatusLinode.data || {};
    if (!d.memory) return;

    const used = d.memory.used_mb;

    this.linodeMemoryHistory = [
      ...this.linodeMemoryHistory,
      { x: Date.now(), y: used }
    ].slice(-50);
  },
};