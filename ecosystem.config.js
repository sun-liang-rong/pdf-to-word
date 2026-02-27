module.exports = {
  apps: [
    {
      name: 'pdf-to-word-backend',
      script: 'dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      listen_timeout: 8000,
      kill_timeout: 5000,
      watch: false
    },
    {
      name: 'pdf-to-word-frontend',
      script: 'node_modules/.bin/next',  // ✅ 修正1：正确的 Next.js 可执行文件路径
      args: 'start -p 3001',             // ✅ 修正2：修改端口避免与后端冲突
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',                  // ✅ 修正3：Next.js 推荐使用 fork 模式
      env: {
        NODE_ENV: 'production',
        PORT: '3001'                      // ✅ 修正4：明确指定端口
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      listen_timeout: 8000,
      kill_timeout: 5000,
      watch: false
    }
  ]
};