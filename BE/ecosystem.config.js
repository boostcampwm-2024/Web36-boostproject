module.exports = {
    apps: [
      {
        name: 'nest-server',
        script: 'BE/dist/main.js', // NestJS 서버의 진입 파일
        instances: 'max',       // 클러스터 모드: CPU 코어 수만큼 프로세스 실행
        exec_mode: 'cluster',   // 클러스터 모드
        watch: true,            // 파일 변경 감지 후 재시작
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  