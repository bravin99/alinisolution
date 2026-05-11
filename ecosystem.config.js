// PM2 Ecosystem Config — Alini Solutions
// Usage:  pm2 start ecosystem.config.js
//         pm2 save
//         pm2 startup   (to survive reboots)

module.exports = {
  apps: [
    {
      name:        'alini-web',
      script:      'node_modules/.bin/next',
      args:        'start',
      cwd:         '/home/alini/alini-web',   // ← update to your actual path
      instances:   2,                          // Use 2 CPU cores; set to 'max' for all cores
      exec_mode:   'cluster',                  // Cluster mode for load balancing
      watch:       false,                      // Don't watch in production
      max_memory_restart: '512M',

      env_production: {
        NODE_ENV: 'production',
        PORT:     3000,
      },

      // Logging
      out_file:    '/var/log/pm2/alini-web-out.log',
      error_file:  '/var/log/pm2/alini-web-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs:  true,

      // Auto-restart settings
      autorestart:         true,
      restart_delay:       3000,
      max_restarts:        10,
      min_uptime:          '10s',

      // Graceful shutdown
      kill_timeout:        5000,
      listen_timeout:      8000,
      shutdown_with_message: false,
    },
  ],
}
