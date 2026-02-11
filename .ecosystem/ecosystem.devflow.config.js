module.exports = {
  apps: [
    {
      name: "futabus",
      script: "dist/main.js",
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      max_memory_restart: "1G",
      cwd: "/home/ubuntu/futabus/source",
      error_file: "/home/ubuntu/futabus/logs/web.err.log",
      out_file: "/home/ubuntu/futabus/logs/web.out.log",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
